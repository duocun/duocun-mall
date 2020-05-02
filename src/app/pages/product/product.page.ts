import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "src/app/services/api/api.service";
import { ProductInterface, getPictureUrl } from "src/app/models/product.model";
import { CartItemInterface, CartInterface } from "src/app/models/cart.model";
import { MerchantInterface } from "src/app/models/merchant.model";
import { CartService } from "src/app/services/cart/cart.service";
import { LocationService } from "src/app/services/location/location.service";
import { LocationInterface } from "src/app/models/location.model";
import * as moment from "moment";
import { DeliveryService } from "src/app/services/delivery/delivery.service";
import {
  DeliveryDateTimeInterface,
  areEqualDeliveryDateTime
} from "src/app/models/delivery.model";
import { AlertController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
const baseTimeList = ["11:00"];
export const AppType = {
  FOOD_DELIVERY: "F",
  GROCERY: "G",
  FRESH: "F",
  TELECOM: "T"
};
@Component({
  selector: "app-product",
  templateUrl: "./product.page.html",
  styleUrls: ["./product.page.scss"]
})
export class ProductPage implements OnInit {
  loading: boolean;
  merchant: MerchantInterface;
  product: ProductInterface;
  item: CartItemInterface; // base item
  // items: Array<CartItemInterface>;
  location: LocationInterface;
  isInRange: boolean;
  schedules: Array<DeliveryDateTimeInterface>;
  deliveryIdx: number; // schedule index
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private cartSvc: CartService,
    private locationSvc: LocationService,
    private deliverySvc: DeliveryService,
    private alert: AlertController,
    private translator: TranslateService
  ) {
    this.loading = true;
    this.isInRange = false;
    this.deliveryIdx = -1;
    // this.items = [];
  }

  ngOnInit() {
    this.locationSvc.getLocation().subscribe((location: LocationInterface) => {
      this.location = location;
    });
    this.updateData();
  }

  updateData() {
    this.route.params.subscribe((params: { id: string }) => {
      const productId = params.id;
      this.api.get(`products/${productId}`).then((observable) => {
        observable.subscribe((data: ProductInterface) => {
          if (data) {
            this.product = data;
            this.api
              .geth(
                "Restaurants/qFind",
                { _id: data.merchantId },
                true,
                "filter"
              )
              .then((merchants: Array<MerchantInterface>) => {
                this.merchant = merchants[0];
                const orderEndList = this.merchant.rules.map((r) => r.orderEnd);
                if (this.merchant) {
                  this.item = {
                    productId: this.product._id,
                    productName: this.product.name,
                    merchantId: this.merchant._id,
                    merchantName: this.merchant.name,
                    price: this.product.price,
                    cost: this.product.cost,
                    quantity: 0,
                    product: this.product
                  };
                  this.api
                    .geth("MerchantSchedules/availables", {
                      merchantId: data.merchantId,
                      location: this.location
                    })
                    .then((schedules: any[]) => {
                      if (schedules && schedules.length > 0) {
                        this.isInRange = true;
                        const dows = schedules[0].rules.map(
                          (r) => +r.deliver.dow
                        );
                        const bs = this.getBaseDateList(orderEndList, dows);
                        this.getDeliverySchedule(
                          this.merchant,
                          bs,
                          baseTimeList
                        );
                      } else {
                        this.isInRange = false;
                      }
                      this.loading = false;
                    });
                }
              });
          } else {
            this.loading = false;
          }
        });
      });
    });
  }

  handleQuantityChange(event, schedule: DeliveryDateTimeInterface) {
    const item = { ...this.item };
    item.delivery = schedule;
    item.quantity = event.value;
    this.cartSvc.setItem(item);
  }

  // addItemsToCart() {
  //   console.log(this.items);
  //   this.items.forEach((item) => {
  //     this.cartSvc.setItem(item);
  //   });
  // }

  buildItem(delivery): CartItemInterface {
    const item = {
      productId: this.product._id,
      productName: this.product.name,
      merchantId: this.merchant._id,
      merchantName: this.merchant.name,
      price: this.product.price,
      cost: this.product.cost,
      quantity: 0,
      product: this.product,
      delivery
    };
    return item;
  }

  getItemQuantity(delivery) {
    return this.cartSvc.getItemQuantity(this.buildItem(delivery));
  }

  getPictureUrl(product: ProductInterface, idx: number) {
    return getPictureUrl(product, idx);
  }

  getBaseDateList(orderEndList, deliverDowList) {
    const myDateTime = moment().format("YYYY-MM-DDTHH:mm:ss") + ".000Z";

    const bs = this.deliverySvc.getBaseDateList(
      myDateTime,
      orderEndList,
      deliverDowList
    );
    return bs.map((b) => b.toISOString());
  }

  getDeliverySchedule(merchant, baseList, deliverTimeList) {
    this.api
      .get("Merchants/G/deliverSchedules", {
        merchantId: this.merchant._id,
        lat: this.location.lat,
        lng: this.location.lng,
        dt: moment().format("YYYY-MM-DDTHH:mm:ss")
      })
      .then((observable) =>
        observable.subscribe(
          (resp: { code: string; data: Array<DeliveryDateTimeInterface> }) => {
            if (resp.code === "success") {
              this.schedules = resp.data;
              // this.initItems();
            }
          }
        )
      );
  }

  // initItems() {
  //   this.items = [];
  //   this.schedules.forEach((delivery) => {
  //     const tempItem = { ...this.item };
  //     tempItem.delivery = delivery;
  //     tempItem.quantity = this.getItemQuantity(delivery);
  //     this.items.push(tempItem);
  //   });
  // }

  showAlert(header, message, button) {
    this.translator.get([header, message, button]).subscribe((dict) => {
      this.alert
        .create({
          header: dict[header],
          message: dict[message],
          buttons: [dict[button]]
        })
        .then((alert) => alert.present());
    });
  }
}

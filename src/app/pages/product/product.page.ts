import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "src/app/services/api/api.service";
import { ProductInterface, getPictureUrl } from "src/app/models/product.model";
import { CartItemInterface } from "src/app/models/cart.model";
import { MerchantInterface } from "src/app/models/merchant.model";
import { CartService } from "src/app/services/cart/cart.service";
import { LocationService } from "src/app/services/location/location.service";
import { LocationInterface } from "src/app/models/location.model";
import * as moment from "moment";
import { DeliveryService } from "src/app/services/delivery/delivery.service";
import { DeliveryDateTimeInterface } from "src/app/models/delivery.model";
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
  item: CartItemInterface;
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
              .geth("Restaurants/qFind", { _id: data.merchantId })
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
                    quantity: 1
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
                        this.schedules = this.getDeliverySchedule(
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

  handleQuantityChange(event: {
    value: number;
    action: "up" | "down" | "set";
  }) {
    this.item.quantity = event.value;
  }

  handleSelectDeliveryDateTime(event) {
    this.deliveryIdx = event.detail.value;
  }

  getPictureUrl(product: ProductInterface, idx: number) {
    return getPictureUrl(product, idx);
  }

  addToCart() {
    if (this.isInRange && this.schedules && this.schedules.length) {
      this.item.delivery = this.schedules[this.deliveryIdx];
      this.item.product = this.product;
      if (this.item.delivery) {
        this.cartSvc.addItem(this.item);
      } else {
        this.showAlert("Notice", "Please select delivery time", "Confirm");
      }
    }
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
    if (merchant.delivers) {
      const myDateTime = moment.utc().format("YYYY-MM-DD HH:mm:ss");
      return this.deliverySvc.getSpecialSchedule(myDateTime, merchant.delivers);
    } else {
      return this.deliverySvc.getDeliverySchedule(baseList, deliverTimeList);
    }
  }

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

import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/services/api/api.service";
import { ProductInterface, getPictureUrl } from "src/app/models/product.model";
import {
  CartItemInterface,
  CartInterface,
  areEqualCartItems
} from "src/app/models/cart.model";
import { MerchantInterface } from "src/app/models/merchant.model";
import { CartService } from "src/app/services/cart/cart.service";
import { LocationService } from "src/app/services/location/location.service";
import { LocationInterface } from "src/app/models/location.model";
import { DeliveryService } from "src/app/services/delivery/delivery.service";
import { DeliveryDateTimeInterface } from "src/app/models/delivery.model";
import { AlertController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment-timezone";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AccountInterface } from "src/app/models/account.model";
import { AuthService } from "src/app/services/auth/auth.service";
import { SeoService } from "src/app/services/seo/seo.service";
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
export class ProductPage implements OnInit, OnDestroy {
  loading: boolean;
  merchant: MerchantInterface;
  product: ProductInterface;
  item: CartItemInterface; // base item
  cart: CartInterface;
  location: LocationInterface;
  isInStock: boolean;
  isInRange: boolean;
  schedules: Array<DeliveryDateTimeInterface>;
  deliveryIdx: number; // schedule index
  account: AccountInterface;
  private unsubscribe$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private cartSvc: CartService,
    private locationSvc: LocationService,
    private deliverySvc: DeliveryService,
    private alert: AlertController,
    private translator: TranslateService,
    public router: Router,
    private authSvc: AuthService,
    private seo: SeoService
  ) {
    this.loading = true;
    this.isInRange = false;
    this.isInStock = false;
    this.deliveryIdx = -1;
    // this.items = [];
  }

  ngOnInit() {
    this.authSvc.account$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((account: AccountInterface) => {
        console.log("product page account subscription");
        this.account = account;
      });
    this.locationSvc
      .getLocation()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((location: LocationInterface) => {
        console.log("product page location subscription");
        this.location = location;
        if (this.account && this.location === null) {
          this.showAlert("Notice", "Please select delivery address", "OK");
          this.router.navigate(["/tabs/my-account/setting"], {
            queryParams: { redirectUrl: this.router.url }
          });
        }
      });
    this.cartSvc.getCart().subscribe((cart: CartInterface) => {
      this.cart = cart;
    });
    this.updateData();
  }

  ngOnDestroy() {
    this.seo.setDefaultSeo();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateData() {
    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params: { id: string }) => {
        console.log("product page route param subscription");
        const productId = params.id;
        this.api.get(`products/${productId}`).then((observable) => {
          observable
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data: ProductInterface) => {
              console.log("product page product subscription");
              if (data) {
                this.product = data;
                this.setIsInStock();
                this.seo.setTitle(this.product.name);
                this.seo.setDescription(this.product.description);
                if (!this.account) {
                  this.loading = false;
                  return;
                }

                this.api
                  .geth(
                    "Restaurants/qFind",
                    { _id: data.merchantId },
                    true,
                    "filter"
                  )
                  .then((merchants: Array<MerchantInterface>) => {
                    this.merchant = merchants[0];
                    const orderEndList = this.merchant.rules.map(
                      (r) => r.orderEnd
                    );
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
                        .get("MerchantSchedules/availables-v2", {
                          merchantId: data.merchantId,
                          location: JSON.stringify(this.location)
                        })
                        .then((observable) => {
                          observable
                            .pipe(takeUntil(this.unsubscribe$))
                            .subscribe((schedules: any[]) => {
                              console.log("product page schedule subscription");
                              if (schedules && schedules.length > 0) {
                                this.isInRange = true;
                                const dows = schedules[0].rules.map(
                                  (r) => +r.deliver.dow
                                );
                                const bs = this.getBaseDateList(
                                  orderEndList,
                                  dows
                                );
                                this.getDeliverySchedule(
                                  this.merchant,
                                  bs,
                                  baseTimeList
                                );
                              } else {
                                this.isInRange = false;
                                this.loading = false;
                              }
                            });
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

  setIsInStock() {
    if (!this.shouldCheckProductQuantity()) {
      this.isInStock = true;
    } else {
      this.isInStock = this.product.stock && this.product.stock.quantity > 0;
    }
  }

  handleQuantityChange(event, schedule: DeliveryDateTimeInterface) {
    const item = { ...this.item };
    item.delivery = schedule;
    item.quantity = event.value;
    if (!this.shouldCheckProductQuantity()) {
      this.cartSvc.setItem(item);
    } else {
      const canAddToCart = this.checkProductQuantity(item);
      if (!canAddToCart) {
        this.showAlert("Notice", "You cannot buy that much.", "OK", () => {
          event.ref.setValue(event.oldValue);
          event.ref.valueInput.value = event.oldValue;
        });
      } else {
        this.cartSvc.setItem(item);
      }
    }
  }

  shouldCheckProductQuantity() {
    return (
      this.product &&
      this.product.stock &&
      this.product.stock.enabled &&
      !this.product.stock.allowNegative
    );
  }

  checkProductQuantity(itemToAdd: CartItemInterface) {
    const items = this.cart.items;
    let quantity = 0;
    items
      .filter((item) => !areEqualCartItems(item, itemToAdd))
      .filter((item) => item.productId === this.product._id)
      .forEach((item) => {
        quantity += item.quantity;
      });
    return (
      this.product.stock.quantity > 0 &&
      quantity + itemToAdd.quantity <= this.product.stock.quantity
    );
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
    console.log("getDeliverySchedule");
    this.api
      .get("Merchants/G/deliverSchedules", {
        merchantId: this.merchant._id,
        lat: this.location.lat,
        lng: this.location.lng,
        dt: moment().format("YYYY-MM-DDTHH:mm:ss")
      })
      .then((observable) =>
        observable
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(
            (resp: {
              code: string;
              data: Array<DeliveryDateTimeInterface>;
            }) => {
              console.log("product page schedule subscription");
              if (resp.code === "success") {
                this.schedules = resp.data.filter((schedule: any) => {
                  return schedule.date > moment().format("YYYY-MM-DD");
                });
                // this.initItems();
              }
              this.loading = false;
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

  showAlert(header, message, button, callback?: any) {
    this.translator
      .get([header, message, button])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((dict) => {
        console.log("product page lang subscription");
        this.alert
          .create({
            header: dict[header],
            message: dict[message],
            buttons: callback
              ? [
                  {
                    text: dict[button],
                    handler: callback
                  }
                ]
              : [dict[button]]
          })
          .then((alert) => alert.present());
      });
  }
}

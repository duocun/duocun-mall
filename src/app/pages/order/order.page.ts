import { Component, OnInit } from "@angular/core";
import { CartService } from "src/app/services/cart/cart.service";
import * as Order from "src/app/models/order.model";
import {
  PaymentMethod,
  AppType,
  PaymentError
} from "src/app/models/payment.model";
import { getPictureUrl, ProductInterface } from "src/app/models/product.model";
import { AccountInterface } from "src/app/models/account.model";
import { AuthService } from "src/app/services/auth/auth.service";
import { ApiService } from "src/app/services/api/api.service";
import { AlertController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { StripeToken } from "stripe-angular";
import { CartInterface } from "src/app/models/cart.model";
import { environment } from "src/environments/environment";
import { loadStripe, Stripe, StripeError } from "@stripe/stripe-js";
import { MerchantInterface } from "src/app/models/merchant.model";
import { LocationInterface } from "src/app/models/location.model";
import { formatLocation } from "src/app/models/location.model";
import { LocationService } from "src/app/services/location/location.service";

interface OrderErrorInterface {
  type: "order" | "payment";
  message: string;
}
@Component({
  selector: "app-order",
  templateUrl: "./order.page.html",
  styleUrls: ["./order.page.scss"]
})
export class OrderPage implements OnInit {
  chargeItems;
  order: Order.OrderInterface;
  orders: Array<Order.OrderInterface>;
  cartItemGroups: Array<Order.CartItemGroupInterface>;
  location: LocationInterface;
  address: string;
  summary: Order.OrderSummaryInterface;
  notes: string;
  account: AccountInterface;
  stripeError: StripeError;
  charge: Order.ChargeInterface;
  cart: CartInterface;
  paymentMethod: string;
  stripe: Stripe;
  loading: boolean;
  processing: boolean;
  error: OrderErrorInterface | null;
  PaymentMethod = PaymentMethod;
  constructor(
    private cartSvc: CartService,
    private authSvc: AuthService,
    private api: ApiService,
    private alert: AlertController,
    private translator: TranslateService,
    private locSvc: LocationService
  ) {
    this.loading = true;
    this.error = null;
    this.processing = false;
    loadStripe(environment.stripe).then((stripe) => {
      this.stripe = stripe;
    });
  }

  async ngOnInit() {
    this.paymentMethod = PaymentMethod.CREDIT_CARD;
    this.authSvc.getAccount().subscribe((account) => {
      this.account = account;
      this.setCharge();
    });
    this.locSvc.getLocation().subscribe((location) => {
      if (location) {
        this.location = location;
        this.address = formatLocation(location);
      }
    });
    this.cartSvc.getCart().subscribe((cart) => {
      this.cart = cart;
      this.chargeItems = Order.getChargeItems(cart);
      this.cartItemGroups = Order.getCartItemGroups(cart);
      this.orders = [];
      for (const cartItemGroup of this.cartItemGroups) {
        this.getOrderFromCartItemGroup(cartItemGroup)
          .then((order: Order.OrderInterface) => {
            this.orders.push(order);
            if (this.orders.length === this.cartItemGroups.length) {
              this.loading = false;
            }
          })
          .catch((e) => {
            console.error(e);
            this.error = {
              type: "order",
              message: "Cannot create order"
            };
          });
      }
      this.summary = Order.getOrderSummary(this.cartItemGroups, 0);
      this.setCharge();
    });
  }

  setCharge() {
    if (this.account && this.summary) {
      const amount = this.summary.total;
      const balance = this.account.balance || 0;
      const payable = balance >= amount ? 0 : amount - balance;
      if (amount !== 0 && balance >= amount) {
        this.paymentMethod = PaymentMethod.PREPAY;
      }
      this.charge = { ...this.summary, payable, balance };
    }
  }

  getPictureUrl(item: ProductInterface) {
    return getPictureUrl(item);
  }

  stripePay(token: StripeToken) {
    this.paymentMethod = PaymentMethod.CREDIT_CARD;
    this.processing = true;
    this.stripe
      .createPaymentMethod({
        type: "card",
        card: {
          token: token.id
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
        billing_details: { name: this.account.username }
      })
      .then((res) => {
        if (res.error) {
          this.showAlert("Notice", "Payment failed", "OK");
          return;
        }
        const paymentMethodId = res.paymentMethod.id;
        this.saveOrders(this.orders)
          .then((observable) => {
            observable.subscribe((newOrders: Array<Order.OrderInterface>) => {
              this.savePayment(newOrders, paymentMethodId)
                .then((observable) => {
                  observable.subscribe((resp: any) => {
                    if (resp.err === PaymentError.NONE) {
                      this.showAlert("Notice", "Payment success", "OK");
                      this.cartSvc.clearCart();
                    } else {
                      this.showAlert("Notice", "Payment failed", "OK");
                    }
                  });
                })
                .catch((e) => {
                  console.error(e);
                  this.error = {
                    type: "payment",
                    message: "Cannot save payment"
                  };
                });
            });
          })
          .catch((e) => {
            console.error(e);
            this.error = {
              type: "order",
              message: "Cannot save orders"
            };
            this.processing = false;
          });
      });
  }

  wechatPay() {
    this.paymentMethod = PaymentMethod.WECHAT;
    // TO DO: implement Wechat Pay
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

  getOrderFromCartItemGroup(cartItemGroup: Order.CartItemGroupInterface) {
    return new Promise((resolve, reject) => {
      const merchantId = cartItemGroup.merchantId;
      this.api
        .get(`Merchants/G/${merchantId}`)
        .then((observable) => {
          observable.subscribe(
            (resp: { code: string; data: MerchantInterface }) => {
              const merchant = resp.data;
              resolve(
                Order.createOrder(
                  this.account,
                  merchant,
                  cartItemGroup.items,
                  this.location,
                  cartItemGroup.date,
                  cartItemGroup.time,
                  Order.getChargeFromCartItemGroup(cartItemGroup, 0),
                  this.notes,
                  this.paymentMethod,
                  this.translator.currentLang
                )
              );
            }
          );
        })
        .catch((e) => reject(e));
    });
  }

  saveOrders(orders: Array<Order.OrderInterface>) {
    return this.api.post("Orders/bulk", orders);
  }

  savePayment(orders: Array<Order.OrderInterface>, paymentMethodId: string) {
    return this.api.post("ClientPayments/payByCreditCard", {
      appType: AppType.GROCERY,
      paymentMethodId,
      accountId: this.account._id,
      accountName: this.account.username,
      orders,
      payable: this.charge.payable,
      paymentNote: ""
    });
  }
}

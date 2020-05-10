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
import { ContextService } from "src/app/services/context/context.service";
import { Router } from "@angular/router";

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
  appCode: string | undefined;
  cartSanitized: boolean;
  constructor(
    private cartSvc: CartService,
    private authSvc: AuthService,
    private api: ApiService,
    private alert: AlertController,
    private translator: TranslateService,
    private locSvc: LocationService,
    private contextSvc: ContextService,
    private router: Router
  ) {
    this.loading = true;
    this.error = null;
    this.processing = false;
    this.cartSanitized = false;
    loadStripe(environment.stripe).then((stripe) => {
      this.stripe = stripe;
    });
    this.contextSvc.getContext().subscribe((context) => {
      this.appCode = context.get("appCode");
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
      if (
        this.cart &&
        this.cart.items &&
        this.cart.items.length &&
        !this.cartSanitized
      ) {
        this.cartSanitized = true;
        this.cartSvc.sanitize();
        return;
      }
      this.chargeItems = Order.getChargeItems(cart);
      this.cartItemGroups = Order.getCartItemGroups(cart);
      this.orders = [];
      if (!this.cartItemGroups.length) {
        this.router.navigate(["/tabs/browse"]);
      }
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

  createStripeToken(stripeCard) {
    this.processing = true;
    stripeCard
      .createToken()
      .then((token) => {
        if (!token) {
          this.processing = false;
        }
      })
      .catch((e) => {
        console.error(e);
        this.processing = false;
      });
  }

  canPayStripe() {
    if (!this.stripe) {
      return false;
    }
    if (this.processing) {
      return false;
    }
    if (this.loading) {
      return false;
    }
    return true;
  }

  setCharge() {
    if (this.account && this.summary) {
      const amount = this.summary.total;
      const balance = this.account.balance || 0;
      const payable = balance >= amount ? 0 : amount - balance;
      if (amount !== 0 && balance >= amount) {
        this.paymentMethod = PaymentMethod.PREPAY;
      } else {
        this.paymentMethod = "";
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
            observable.subscribe(
              (resp: { code: string; data: Array<Order.OrderInterface> }) => {
                if (resp.code !== "success") {
                  return this.handleInvalidOrders(resp.data);
                }
                const newOrders = resp.data;
                this.savePayment(newOrders, paymentMethodId)
                  .then((observable) => {
                    observable.subscribe((resp: any) => {
                      if (resp.err === PaymentError.NONE) {
                        this.showAlert("Notice", "Payment success", "OK");
                        this.cartSvc.clearCart();
                        this.router.navigate(
                          ["/tabs/my-account/order-history"],
                          {
                            replaceUrl: true
                          }
                        );
                        this.processing = false;
                      } else {
                        this.showAlert("Notice", "Payment failed", "OK");
                        this.processing = false;
                      }
                    });
                  })
                  .catch((e) => {
                    console.error(e);
                    this.error = {
                      type: "payment",
                      message: "Cannot save payment"
                    };
                    this.processing = false;
                  });
              }
            );
          })
          .catch((e) => {
            console.error(e);
            this.error = {
              type: "order",
              message: "Cannot save orders"
            };
            this.processing = false;
          });
      })
      .catch((e) => {
        console.error(e);
        this.processing = false;
      });
  }

  wechatPay() {
    this.paymentMethod = PaymentMethod.WECHAT;
    this.processing = true;
    this.saveOrders(this.orders).then((observable) => {
      observable.subscribe(
        (resp: { code: string; data: Array<Order.OrderInterface> }) => {
          if (resp.code !== "success") {
            return this.handleInvalidOrders(resp.data);
          }
          this.payBySnappay(
            this.appCode,
            this.account._id,
            resp.data,
            this.charge.payable
          );
        }
      );
    });
  }

  payByDeposit() {
    this.saveOrders(this.orders).then((observable) => {
      observable.subscribe(
        (resp: { code: string; data: Array<Order.OrderInterface> }) => {
          if (resp.code !== "success") {
            return this.handleInvalidOrders(resp.data);
          }
          this.showAlert("Notice", "Payment success", "OK");
          this.cartSvc.clearCart();
          this.authSvc.updateData();
          this.router.navigate(["/tabs/my-account/order-history"]);
          this.paymentMethod = "";
        }
      );
    });
  }

  handleInvalidOrders(resp) {
    this.processing = false;
    if (resp.message === "out of stock") {
      if (resp.product.quantity && resp.product.quantity > 0) {
        const msg1 = "Please adjust the quantity of the product";
        const msg2 = "Max quantity";
        this.translator
          .get(msg1, {
            value: this.getProductName(resp.product)
          })
          .subscribe((message1: string) => {
            this.translator
              .get(msg2, {
                value: resp.product.quantity
              })
              .subscribe((message2: string) => {
                this.showAlert("Notice", `${message1}\n${message2}`, "OK");
                this.router.navigate(["/tabs/cart"]);
              });
          });
      } else {
        const message = "Product is out of stock";
        this.translator
          .get(message, {
            value: this.getProductName(resp.product)
          })
          .subscribe((message1: string) => {
            this.showAlert("Notice", message1, "OK");
            this.router.navigate(["/tabs/cart"]);
          });
      }
    } else if (resp.message === "delivery expired") {
      this.showAlert("Notice", "Cart item delivery has expired", "OK");
      this.router.navigate(["/tabs/cart"]);
    }
  }

  getProductName(product) {
    const lang = this.translator.currentLang;
    if (lang === "zh") {
      return product.name;
    } else {
      if (product.nameEN) {
        return product.nameEN;
      } else {
        return product.name;
      }
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

  getOrderFromCartItemGroup(cartItemGroup: Order.CartItemGroupInterface) {
    return new Promise((resolve, reject) => {
      const merchantId = cartItemGroup.merchantId;
      this.api
        .get(`Merchants/G/${merchantId}`)
        .then((observable) => {
          observable.subscribe(
            (resp: { code: string; data: MerchantInterface }) => {
              const merchant = resp.data;
              if (merchant && this.account) {
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
            }
          );
        })
        .catch((e) => reject(e));
    });
  }

  saveOrders(orders: Array<Order.OrderInterface>) {
    orders.forEach((order) => {
      order.note = this.notes;
      order.paymentMethod = this.paymentMethod;
    });
    return this.api.post("Orders/bulk", orders);
  }

  savePayment(orders: Array<Order.OrderInterface>, paymentMethodId: string) {
    return this.api.post("ClientPayments/payByCreditCard", {
      paymentActionCode: "P",
      appCode: this.appCode,
      paymentMethodId,
      accountId: this.account._id,
      accountName: this.account.username,
      amount: this.charge.payable,
      note: "",
      paymentId: orders ? orders[0].paymentId : null,
      merchantNames: orders.map((order) => order.merchantName)
    });
  }

  payBySnappay(
    appCode: string,
    accountId: string,
    orders: Array<Order.OrderInterface>,
    amount: number
  ) {
    const returnUrl =
      window.location.origin +
      `/mall/tabs/my-account/transaction-history?state=${this.appCode}`;
    const paymentId = orders ? orders[0].paymentId : null;
    this.api
      .post("ClientPayments/payBySnappay", {
        paymentActionCode: "P",
        appCode,
        accountId,
        amount,
        returnUrl,
        note: "",
        paymentId,
        merchantNames: orders.map((order) => order.merchantName)
      })
      .then((observable) => {
        observable.subscribe((resp: any) => {
          if (resp.err === PaymentError.NONE) {
            this.cartSvc.clearCart();
            window.location.href = resp.url;
          } else {
            this.showAlert("Notice", "Payment failed", "OK");
            this.processing = false;
          }
        });
      })
      .catch((e) => {
        console.error(e);
        this.showAlert("Notice", "Payment failed", "OK");
        this.processing = false;
      });
  }
}

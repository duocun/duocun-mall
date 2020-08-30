import { Component, OnInit, OnDestroy } from "@angular/core";
import { CartService } from "src/app/services/cart/cart.service";
import * as Order from "src/app/models/order.model";
import {
  PaymentMethod,
  PaymentError,
  AlphapayResponseType,
  IPaymentResponse
} from "src/app/models/payment.model";
import { getPictureUrl, ProductInterface } from "src/app/models/product.model";
import { AccountInterface } from "src/app/models/account.model";
import { AuthService } from "src/app/services/auth/auth.service";
import { ApiService } from "src/app/services/api/api.service";
import { AlertController, LoadingController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { CartInterface } from "src/app/models/cart.model";
import { MerchantInterface } from "src/app/models/merchant.model";
import { LocationInterface } from "src/app/models/location.model";
import { formatLocation } from "src/app/models/location.model";
import { LocationService } from "src/app/services/location/location.service";
import { ContextService } from "src/app/services/context/context.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Subject } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";
import * as moment from "moment";
import { DeviceDetectorService } from "ngx-device-detector";
import { SocketService } from "src/app/services/socket/socket.service";

import {
  SnappayPaymentMethod,
  SnappayMethod
} from "../../models/payment.model";

import { PaymentService } from "src/app/services/payment";

interface OrderErrorInterface {
  type: "order" | "payment";
  message: string;
}
@Component({
  selector: "app-order",
  templateUrl: "./order.page.html",
  styleUrls: ["./order.page.scss"]
})
export class OrderPage implements OnInit, OnDestroy {
  chargeItems;
  order: Order.OrderInterface;
  orders: Array<Order.OrderInterface>;
  cartItemGroups: Array<Order.CartItemGroupInterface>;
  location: LocationInterface;
  address: string;
  summary: Order.OrderSummaryInterface;
  notes: string;
  account: AccountInterface;
  charge: Order.ChargeInterface;
  cart: CartInterface;
  cartSubscription: Subscription;
  paymentMethod: string;
  loading: boolean;
  processing: boolean;
  error: OrderErrorInterface | null;
  PaymentMethod = PaymentMethod;
  appCode: string | undefined;
  cartSanitized: boolean;
  loadingOverlay: any;
  cc: string;
  exp: string;
  cvd: string;
  isMobile: boolean;
  alphaPayResponse: AlphapayResponseType | null;
  title = "Confirm Order";
  backBtn = { url: "/tabs/cart", text: "" };
  private unsubscribe$ = new Subject<void>();
  constructor(
    private cartSvc: CartService,
    private authSvc: AuthService,
    private api: ApiService,
    private alert: AlertController,
    private translator: TranslateService,
    private locSvc: LocationService,
    private contextSvc: ContextService,
    private paymentSvc: PaymentService,
    private router: Router,
    private loader: LoadingController,
    private deviceDetector: DeviceDetectorService,
    private socketSvc: SocketService
  ) {
    this.loading = true;
    this.error = null;
    this.processing = false;
    this.cartSanitized = false;
    this.isMobile = this.deviceDetector.isMobile();
    this.contextSvc
      .getContext()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((context) => {
        console.log("order page context subscription");
        this.appCode = context.get("appCode");
      });
  }

  async ngOnInit() {
    // fix me
    // await this.socketSvc.joinPaymentRoom();
    // this.socketSvc.alphaPayResp.subscribe(
    //   (payload: { success: boolean; paymentId: string }) => {
    //     if (!payload) {
    //       return;
    //     }
    //     if (payload.success) {
    //       this.router.navigate(["/payment-success"], {
    //         queryParams: {
    //           paymentId: payload.paymentId
    //         }
    //       });
    //     } else {
    //       console.warn("Payment failed");
    //       console.log(payload);
    //     }
    //   }
    // );

    await this.presentLoading();
    this.paymentMethod = PaymentMethod.CREDIT_CARD;
    this.authSvc
      .getAccount()
      .pipe(
        filter((account) => !!account),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((account) => {
        console.log("order page account subscription");
        if (!account.phone) {
          this.showAlert("Notice", "Please input phone number", "OK");
          this.router.navigate(["/tabs/my-account/setting"], {
            queryParams: { redirectUrl: "/tabs/browse/order" },
            replaceUrl: true
          });
        }
        this.account = account;
        this.setCharge();
        this.locSvc
          .getLocation()
          .pipe(
            filter((location) => !!location),
            takeUntil(this.unsubscribe$)
          )
          .subscribe((location) => {
            console.log("order page location subscription");
            this.location = location;
            this.address = formatLocation(location);
            this.cartSubscription = this.cartSvc
              .getCart()
              .pipe(
                filter((cart) => !!cart),
                takeUntil(this.unsubscribe$)
              )
              .subscribe(async (cart) => {
                console.log("order page cart subscription");
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
                  await this.dismissLoading();
                  return this.router.navigate(["/tabs/browse"], {
                    replaceUrl: true
                  });
                }
                try {
                  for (const cartItemGroup of this.cartItemGroups) {
                    const order = await this.getOrderFromCartItemGroup(
                      cartItemGroup
                    );
                    this.orders.push(order);
                  }
                } catch (e) {
                  this.error = {
                    type: "order",
                    message: "Cannot create order"
                  };
                }
                this.summary = Order.getOrderSummary(this.cartItemGroups, 0);
                this.setCharge();
                this.loading = false;
                await this.dismissLoading();
              });
          });
      });
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
    // this.socketSvc.alphaPayResp.unsubscribe();
    this.alphaPayResponse = null;
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async presentLoading() {
    const message =
      this.translator.currentLang === "zh" ? "处理中..." : "Processing...";
    if (this.loadingOverlay) {
      return;
    }
    this.loadingOverlay = await this.loader.create({
      message
    });
    await this.loadingOverlay.present();
  }

  async dismissLoading() {
    if (this.loadingOverlay) {
      await this.loadingOverlay.dismiss();
    }
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

  wechatPay() {
    this.paymentMethod = PaymentMethod.WECHAT;
    this.processing = true;
    this.presentLoading();
    this.saveOrders(this.orders).then((observable) => {
      observable
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (resp: { code: string; data: Array<Order.OrderInterface> }) => {
            console.log("order page save order subscription");
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

  /**
   *  paymentMethod --- SnappayPaymentMethod: ALIPAY WECHATPAY UNIONPAY
   *  method --- SnappayMethod
   *
   */
  handleSnappay(paymentMethod: string, method: string) {
    this.paymentMethod = paymentMethod;
    this.processing = true;
    this.presentLoading();
    this.saveOrders(this.orders).then((observable) => {
      observable
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (resp: { code: string; data: Array<Order.OrderInterface> }) => {
            console.log("order page save order subscription");
            if (resp.code !== "success") {
              return this.handleInvalidOrders(resp.data);
            }

            this.payBySnappayV2(
              this.appCode,
              method,
              paymentMethod,
              resp.data,
              this.charge.payable,
              "Description"
            );
          }
        );
    });
  }

  snappayByAliQrcode() {
    this.handleSnappay(SnappayPaymentMethod.ALI, SnappayMethod.QRCODE);
  }

  snappayByWechatQrcode() {
    this.handleSnappay(SnappayPaymentMethod.WECHAT, SnappayMethod.QRCODE);
  }

  snappayByWechatH5() {
    this.handleSnappay(SnappayPaymentMethod.WECHAT, SnappayMethod.H5);
  }

  payByDeposit() {
    this.saveOrders(this.orders).then((observable) => {
      observable
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          async (resp: { code: string; data: Array<Order.OrderInterface> }) => {
            console.log("order page save order subscription");
            if (resp.code !== "success") {
              return this.handleInvalidOrders(resp.data);
            }
            this.showAlert("Notice", "Payment success", "OK");
            this.cartSubscription.unsubscribe();
            this.cartSvc.clearCart();
            await this.authSvc.updateData();
            this.router.navigate(["/tabs/my-account/order-history"], {
              replaceUrl: true
            });
            this.paymentMethod = "";
          }
        );
    });
  }

  handleInvalidOrders(resp) {
    this.processing = false;
    this.dismissLoading();
    if (resp.message === "out of stock") {
      if (resp.product.quantity && resp.product.quantity > 0) {
        const msg1 = "Please adjust the quantity of the product";
        const msg2 = "Max quantity";
        this.translator
          .get(msg1, {
            value: this.getProductName(resp.product)
          })
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((message1: string) => {
            console.log("order page lang subscription");
            this.translator
              .get(msg2, {
                value: resp.product.quantity
              })
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe((message2: string) => {
                console.log("order page lang subscription");
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
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((message1: string) => {
            console.log("order page lang subscription");
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
    this.translator
      .get([header, message, button])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((dict) => {
        console.log("order page lang subscription");
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
    console.log("getOrderFromCartItemGroup");
    return new Promise((resolve, reject) => {
      const merchantId = cartItemGroup.merchantId;
      this.api
        .get(`Merchants/G/${merchantId}`)
        .then((observable) => {
          observable
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((resp: { code: string; data: MerchantInterface }) => {
              console.log("order page merchant subscription");
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
              } else {
                reject({
                  merchant,
                  account: this.account
                });
              }
            });
        })
        .catch((e) => reject(e));
    });
  }

  saveOrders(orders: Array<Order.OrderInterface>) {
    for (const order of orders) {
      if (order.deliverDate < moment().format("YYYY-MM-DD")) {
        this.showAlert("Notice", "Deliver date is expired", "OK");
        this.router.navigate(["tabs/browse/cart"], {
          replaceUrl: true
        });
        return;
      }
      order.note = this.notes;
      order.paymentMethod = this.paymentMethod;
      switch (order.paymentMethod) {
        case PaymentMethod.PREPAY:
          order.status = Order.OrderStatus.NEW;
          break;
        default:
          order.status = Order.OrderStatus.TEMP;
          break;
      }
    }
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

  payBySnappayV2(
    appCode: string,
    method: string,
    paymentMethod: string,
    // accountId: string,
    orders: Array<Order.OrderInterface>,
    amount: number,
    description: string
  ) {
    const returnUrl = `${window.location.origin}/tabs/my-account/transaction-history?state=${appCode}`;
    this.paymentSvc
      .pay(
        "snappay",
        method,
        paymentMethod,
        orders,
        amount,
        description,
        returnUrl
      )
      .then((observable) => {
        observable
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((resp: IPaymentResponse) => {
            if (resp.err === PaymentError.NONE) {
              this.cartSubscription.unsubscribe();
              this.cartSvc.clearCart();
              window.location.href = resp.url;
            } else {
              // fix me
              // if (resp.data) {
              //   this.handleInvalidOrders(resp.data);
              // } else {
              this.showAlert("Notice", "Payment failed", "OK");
              this.processing = false;
              this.dismissLoading();
              //}
            }
          });
      })
      .catch((e) => {
        console.error(e);
        this.showAlert("Notice", "Payment failed", "OK");
        this.processing = false;
        this.dismissLoading();
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
      `/tabs/my-account/transaction-history?state=${this.appCode}`;
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
        observable.pipe(takeUntil(this.unsubscribe$)).subscribe((resp: any) => {
          console.log("order page pay by snappay subscription");
          if (resp.err === PaymentError.NONE) {
            this.cartSubscription.unsubscribe();
            this.cartSvc.clearCart();
            window.location.href = resp.url;
          } else {
            if (resp.data) {
              this.handleInvalidOrders(resp.data);
            } else {
              this.showAlert("Notice", "Payment failed", "OK");
              this.processing = false;
              this.dismissLoading();
            }
          }
        });
      })
      .catch((e) => {
        console.error(e);
        this.showAlert("Notice", "Payment failed", "OK");
        this.processing = false;
        this.dismissLoading();
      });
  }

  async monerisPay() {
    const valid = this.isCardValid();
    if (!valid.isValid) {
      this.showAlert("Notice", valid.message, "OK");
      return;
    }
    this.paymentMethod = PaymentMethod.CREDIT_CARD;
    this.processing = true;
    await this.presentLoading();
    this.saveOrders(this.orders).then((observable) => {
      observable
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (resp: { code: string; data: Array<Order.OrderInterface> }) => {
            console.log("order page save order subscription");
            if (resp.code !== "success") {
              return this.handleInvalidOrders(resp.data);
            }
            const order: Order.OrderInterface = resp.data[0];
            this.api
              .post("ClientPayments/moneris/htpay", {
                paymentId: order.paymentId,
                cc: this.cc,
                exp: this.exp,
                cvd: this.cvd
              })
              .then((observable) => {
                observable.toPromise().then(async (resp: any) => {
                  if (resp.err == PaymentError.NONE) {
                    this.showAlert("Notice", "Payment success", "OK");
                    this.cartSubscription.unsubscribe();
                    this.cartSvc.clearCart();
                    await this.authSvc.updateData();
                    this.processing = false;
                    await this.dismissLoading();
                    console.log("navigate to order history");
                    this.router.navigate(["/tabs/my-account/order-history"], {
                      replaceUrl: true
                    });
                  } else {
                    if (resp.data) {
                      this.handleInvalidOrders(resp.data);
                    } else {
                      if (resp.msg) {
                        const message = "Moneris_" + resp.msg;
                        this.showAlert("Notice", message, "OK");
                      } else {
                        this.showAlert("Notice", "Payment failed", "OK");
                      }
                      this.processing = false;
                      this.dismissLoading();
                    }
                  }
                });
              });
          }
        );
    });
  }

  getMonerisTicket(
    appCode: string,
    accountId: string,
    orders: Array<Order.OrderInterface>,
    payable: number
  ) {
    throw new Error("Use moneris ht payment instead");
    const paymentId = orders[0].paymentId;
    this.api
      .post("ClientPayments/moneris/preload", {
        paymentId
      })
      .then((observable) => {
        observable
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((resp: { code: string; data?: string }) => {
            console.log("order page moneris preload subscription");
            if (resp.code === "success") {
              this.processing = false;
              this.dismissLoading();
              this.router.navigate(
                [`/tabs/browse/order/pay/moneris/${paymentId}/${resp.data}`],
                {
                  replaceUrl: true
                }
              );
            } else {
              this.showAlert("Notice", "Payment failed", "OK");
              this.processing = false;
              this.dismissLoading();
            }
          });
      })
      .catch((e) => {
        console.error(e);
        this.showAlert("Notice", "Payment failed", "OK");
        this.processing = false;
      });
  }

  isCardValid() {
    if (!this.cc || this.cc.length < 10) {
      return {
        isValid: false,
        message: "Moneris_invalid_card_number"
      };
    }
    if (!this.cvd || this.cvd.length !== 3) {
      return {
        isValid: false,
        message: "Moneris_invalid_cvd"
      };
    }
    if (!this.exp || this.exp.length !== 4) {
      return {
        isValid: false,
        message: "Moneris_invalid_exp"
      };
    }
    return { isValid: true };
  }

  isWechatBrowser() {
    return /micromessenger/i.test(navigator.userAgent);
  }

  prefersDark() {
    return (
      window.matchMedia("(prefers-color-scheme: dark)").matches ||
      document.body.classList.contains("dark")
    );
  }

  async alphaPayByQRCode(channel: "wechat" | "alipay" | "unionpay") {
    if (this.isMobile && channel != "wechat") {
      return this.alphaPayH5(channel);
    }
    if (channel == "wechat") this.paymentMethod = PaymentMethod.ALPHA_WECHAT;
    if (channel == "alipay") this.paymentMethod = PaymentMethod.ALPHA_ALIPAY;
    if (channel == "unionpay") {
      this.paymentMethod = PaymentMethod.ALPHA_UNIONPAY;
    }
    this.processing = true;
    await this.presentLoading();
    this.saveOrders(this.orders).then((observable) => {
      observable.toPromise().then(async (resp: any) => {
        if (resp.code !== "success") {
          return this.handleInvalidOrders(resp.data);
        }
        const order: Order.OrderInterface = resp.data[0];
        this.api
          .post("ClientPayments/alphapay/qrcode", {
            paymentId: order.paymentId,
            channel
          })
          .then((observable) => {
            observable.toPromise().then((resp: any) => {
              this.handleAlphapayQRCodeResponse(resp);
            });
          })
          .catch((e) => {
            console.error(e);
            this.showAlert("Notice", "Payment failed", "OK");
            this.processing = false;
            this.dismissLoading();
          });
      });
    });
  }

  async alphaPayH5(channel: "alipay" | "unionpay") {
    this.paymentMethod =
      channel == "alipay"
        ? PaymentMethod.ALPHA_ALIPAY
        : PaymentMethod.ALPHA_UNIONPAY;
    this.processing = true;
    await this.presentLoading();
    this.saveOrders(this.orders).then((observable) => {
      observable.toPromise().then(async (resp: any) => {
        if (resp.code !== "success") {
          return this.handleInvalidOrders(resp.data);
        }
        const order: Order.OrderInterface = resp.data[0];
        this.api
          .post("ClientPayments/alphapay/h5", {
            paymentId: order.paymentId,
            channel
          })
          .then((observable) => {
            observable.toPromise().then((resp: any) => {
              if (resp && resp.code === "success") {
                window.location.href = resp.redirect_url;
              } else {
                this.alphaPayResponse = null;
                this.showAlert("Notice", "Payment failed", "OK");
              }
            });
          })
          .catch((e) => {
            console.error(e);
            this.showAlert("Notice", "Payment failed", "OK");
            this.processing = false;
            this.dismissLoading();
          });
      });
    });
  }

  async alphaPayJSApi(channel = "wechat") {
    this.paymentMethod = PaymentMethod.ALPHA_WECHAT;
    this.processing = true;
    await this.presentLoading();
    this.saveOrders(this.orders).then((observable) => {
      observable.toPromise().then(async (resp: any) => {
        if (resp.code !== "success") {
          return this.handleInvalidOrders(resp.data);
        }
        const order: Order.OrderInterface = resp.data[0];
        this.api
          .post("ClientPayments/alphapay/jsapi", {
            paymentId: order.paymentId,
            channel
          })
          .then((observable) => {
            observable.toPromise().then((resp: any) => {
              if (resp && resp.code === "success") {
                window.location.href = resp.redirect_url;
              } else {
                this.alphaPayResponse = null;
                this.showAlert("Notice", "Payment failed", "OK");
              }
            });
          })
          .catch((e) => {
            console.error(e);
            this.showAlert("Notice", "Payment failed", "OK");
            this.processing = false;
            this.dismissLoading();
          });
      });
    });
  }

  handleAlphapayQRCodeResponse(resp: AlphapayResponseType) {
    console.log(resp);
    if (resp.code == "success") {
      this.alphaPayResponse = resp;
    } else {
      this.alphaPayResponse = null;
      this.showAlert("Notice", "Payment failed", "OK");
    }
    this.processing = false;
    this.dismissLoading();
  }

  cancelAlphaPay() {
    this.alphaPayResponse = null;
  }

  getPaymentGatewayLogo(gateway = "", size: "small" | "large" = "small") {
    gateway = String(gateway).toLowerCase();
    switch (gateway) {
      case "moneris":
        return "assets/img/moneris.svg";
      case "wechat":
        return size === "small"
          ? "assets/img/wechat_pay_light.png"
          : "assets/img/wechat_pay.png";
      case "alipay":
        return size === "small"
          ? "assets/img/alipay_transparent.png"
          : "assets/img/alipay.svg";
      case "unionpay":
        return size === "small"
          ? "assets/img/union_pay_small.png"
          : "assets/img/union_pay.png";
      case "unionpayonline":
        return "assets/img/union_pay.png";
    }
  }
}

import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { AlertController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from "src/app/services/api/api.service";
import { CartService } from "src/app/services/cart/cart.service";
import "../../../../assets/plugins/moneris-checkout";

declare const monerisCheckout: any;

@Component({
  selector: "moneris-checkout",
  templateUrl: "./moneris-checkout.component.html",
  styleUrls: ["./moneris-checkout.component.scss"]
})
export class MonerisCheckoutComponent implements OnInit, OnDestroy {
  moneris: any;
  ticket: string;
  paymentId: string;
  paymentReceiptHandled: boolean;
  private unsubscribe$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alert: AlertController,
    private translator: TranslateService,
    private api: ApiService,
    private cartSvc: CartService
  ) {
    this.paymentReceiptHandled = false;
  }

  ngOnInit() {
    this.moneris = new monerisCheckout();
    this.moneris.setMode("prod");
    this.moneris.setCheckoutDiv("monerisCheckoutDiv");
    this.moneris.setCallback("page_loaded", (e) => {
      this.onPageLoad(e);
      //@ts-ignore
      monerisCheckoutDiv.classList.add("loaded");
    });
    this.moneris.setCallback("cancel_transaction", (e) => {
      this.onCancelTransaction(e);
    });
    this.moneris.setCallback("error_event", (e) => {
      this.onErrorEvent(e);
    });
    this.moneris.setCallback("payment_receipt", (e) => {
      this.onPaymentReceipt(e);
    });
    this.moneris.setCallback("payment_complete", (e) => {
      this.onPaymentComplete(e);
    });
    this.route.params.pipe(takeUntil(this.unsubscribe$)).subscribe((params) => {
      this.paymentId = params.paymentId;
      this.ticket = params.ticket;
      if (this.ticket) {
        this.moneris.startCheckout(this.ticket);
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onPageLoad(e) {
    console.log("onPageLoad", e);
    e = JSON.parse(e);
    // if (e.response_code !== "001") {
    //   console.log("response_code: " + e.response_code);
    //   this.router.navigate(["/tabs/browse/order"], {
    //     replaceUrl: true
    //   });
    // }
  }
  onCancelTransaction(e) {
    console.log("onCancelTransaction", e);
    console.log(e);
    this.moneris.closeCheckout();
    this.router.navigate(["/tabs/browse/order"], {
      replaceUrl: true
    });
  }
  onErrorEvent(e) {
    console.log("onErrorEvent", e);
    this.showAlert("Notice", "Payment failed", "OK");
    this.moneris.closeCheckout();
    this.router.navigate(["/tabs/browse"], {
      replaceUrl: true
    });
  }
  onPaymentReceipt(e: any) {
    if (this.paymentReceiptHandled) {
      console.log("payment receipt already handled", e);
      return;
    }
    this.paymentReceiptHandled = true;
    console.log("onPaymentReceipt", e);
    e = JSON.parse(e);
    if (e.response_code === "001") {
      this.api
        .post("ClientPayments/moneris/receipt", {
          paymentId: this.paymentId,
          ticket: this.ticket
        })
        .then((observable) => {
          observable
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((resp: { code: string; data: any }) => {
              console.log("moneris page receipt subscription");
              if (resp.code === "success") {
                this.moneris.closeCheckout();
                this.cartSvc.clearCart();
                this.router.navigate(["/tabs/my-account/order-history"], {
                  replaceUrl: true
                });
              } else {
                this.showAlert("Notice", "Payment failed", "OK");
              }
            });
        });
    } else {
      this.showAlert("Notice", "Payment failed", "OK");
    }
  }
  onPaymentComplete(e) {
    // this.moneris.closeCheckout();
    if (this.paymentReceiptHandled) {
      console.log("payment receipt already handled", e);
      return;
    }
    this.paymentReceiptHandled = true;
    console.log("onPaymentComplete", e);
    e = JSON.parse(e);
    if (e.response_code === "001") {
      this.api
        .post("ClientPayments/moneris/receipt", {
          paymentId: this.paymentId,
          ticket: this.ticket
        })
        .then((observable) => {
          observable
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((resp: { code: string; data: any }) => {
              console.log("moneris page receipt subscription");
              if (resp.code === "success") {
                this.moneris.closeCheckout();
                this.cartSvc.clearCart();
                this.router.navigate(["/tabs/my-account/order-history"], {
                  replaceUrl: true
                });
              } else {
                this.moneris.closeCheckout();
                this.router.navigate(["/tabs/browse/order"], {
                  replaceUrl: true
                });
                this.showAlert("Notice", "Payment failed", "OK");
              }
            });
        });
    } else {
      this.moneris.closeCheckout();
      this.router.navigate(["/tabs/browse/order"], {
        replaceUrl: true
      });
      this.showAlert("Notice", "Payment failed", "OK");
    }
  }

  showAlert(header, message, button) {
    this.translator
      .get([header, message, button])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((dict) => {
        console.log("moneris page lang subscription");
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

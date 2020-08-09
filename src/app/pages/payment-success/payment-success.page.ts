import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { CartService } from "src/app/services/cart/cart.service";

@Component({
  selector: "app-payment-success",
  templateUrl: "./payment-success.page.html",
  styleUrls: ["./payment-success.page.scss"]
})
export class PaymentSuccessPage implements OnInit {
  paymentId: string;
  channel: string;
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private alert: AlertController,
    private translator: TranslateService,
    private router: Router,
    private cartSvc: CartService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.paymentId = params.paymentId;
      this.channel = params.channel;
      this.api
        .post("ClientPayments/check-payment", {
          paymentId: this.paymentId
        })
        .then((observable) => {
          observable.toPromise().then((resp: any) => {
            if (resp.code == "success") {
              this.showAlert("Notice", "Payment success", "OK");
              this.router.navigate(["/tabs/my-account/order-history"]);
              this.cartSvc.clearCart();
            } else {
              this.showAlert("Notice", "Payment failed", "OK");
              this.router.navigate(["/tabs/browse/order"]);
            }
          });
        })
        .catch((e) => {
          console.error(e);
          this.showAlert("Notice", "Payment failed", "OK");
          this.router.navigate(["/tabs/browse/order"]);
        });
    });
  }

  showAlert(header, message, button) {
    this.translator.get([header, message, button]).subscribe((dict) => {
      console.log("home page lang subscription");
      console.log(dict);
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

import { Component, OnInit } from "@angular/core";
import { CartService } from "src/app/services/cart/cart.service";
import * as Order from "src/app/models/order.model";
import { getPictureUrl, ProductInterface } from "src/app/models/product.model";
import { AccountInterface } from "src/app/models/account.model";
import { AuthService } from "src/app/services/auth/auth.service";
import { ApiService } from "src/app/services/api/api.service";
import { AlertController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { StripeToken } from "stripe-angular";
@Component({
  selector: "app-order",
  templateUrl: "./order.page.html",
  styleUrls: ["./order.page.scss"]
})
export class OrderPage implements OnInit {
  chargeItems;
  order: Order.OrderInterface;
  orderGroups: Array<any>;
  address: string;
  summary: Order.OrderSummaryInterface;
  notes: string;
  account: AccountInterface;
  stripeError: any;
  constructor(
    private cartSvc: CartService,
    private authSvc: AuthService,
    private api: ApiService,
    private alert: AlertController,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.authSvc.getAccount().subscribe((account) => {
      this.account = account;
    });
    this.cartSvc.getCart().subscribe((cart) => {
      this.chargeItems = Order.getChargeItems(cart);
      this.orderGroups = Order.getOrderGroups(cart);
      this.summary = Order.getOrderSummary(this.orderGroups, 0);
    });
  }

  getPictureUrl(item: ProductInterface) {
    return getPictureUrl(item);
  }

  stripePay(token: StripeToken) {
    console.log(token);
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

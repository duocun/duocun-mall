import { Component, OnInit } from "@angular/core";
import { CartService } from "src/app/services/cart/cart.service";
import { CartInterface } from "src/app/models/cart.model";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { AuthService } from "src/app/services/auth/auth.service";
import { ApiService } from "src/app/services/api/api.service";
import { AccountInterface } from "src/app/models/account.model";
import { AlertController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit {
  cart: CartInterface;
  clientId: string;
  page: string;
  account: AccountInterface;
  constructor(
    private cartService: CartService,
    private route: ActivatedRoute,
    private authSvc: AuthService,
    private api: ApiService,
    private alert: AlertController,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.handleQueryParams();
    this.initCart();
  }

  handleQueryParams() {
    this.route.queryParamMap.subscribe((paramAsMap: ParamMap) => {
      this.clientId = paramAsMap.get("cid");
      this.page = paramAsMap.get("p");
      switch (this.page) {
        case "b":
          this.handleCreditByWeChat(paramAsMap);
          break;
        case "h":
          this.handleWeChatPay(paramAsMap);
          break;
        default:
          this.initAccount(paramAsMap);
          break;
      }
    });
  }

  initCart() {
    this.cartService.getCart().subscribe((cart: CartInterface) => {
      this.cart = cart;
    });
  }

  initAccount(params: ParamMap) {
    const tokenId: string = params.get("token");
    const appCode = params.get("state");
    if (!tokenId) {
      this.authSvc.getToken().then((tokenId) => {
        if (tokenId) {
          this.getCurrentAccount(tokenId);
        }
      });
    } else {
      this.getCurrentAccount(tokenId);
    }
  }

  getCurrentAccount(tokenId: any) {
    this.api.get(`Accounts/G/token/${tokenId}`).then((observable) => {
      observable.subscribe((resp: { code: string; data: AccountInterface }) => {
        if (resp.code === "success") {
          this.account = resp.data;
          this.authSvc.login(tokenId);
        } else {
          this.authSvc.logout();
          this.showAlert("Notice", "Login failed", "OK");
        }
      });
    });
  }

  handleCreditByWeChat(params: ParamMap) {
    console.log("handleCreditByWeChat called");
  }

  handleWeChatPay(params: ParamMap) {
    console.log("handleWeChatPay called");
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

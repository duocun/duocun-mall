import { Component, OnInit } from "@angular/core";
import { CartService } from "src/app/services/cart/cart.service";
import { CartInterface } from "src/app/models/cart.model";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth/auth.service";
import { ApiService } from "src/app/services/api/api.service";
import { AccountInterface } from "src/app/models/account.model";
import { AlertController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { ContextService } from "src/app/services/context/context.service";
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
  /**
   * prevents permanent redirecting
   * Ionic tab routing does not clear query params
   */
  redirecting: boolean;
  constructor(
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private authSvc: AuthService,
    private api: ApiService,
    private alert: AlertController,
    private translator: TranslateService,
    private context: ContextService
  ) {}

  ngOnInit() {
    this.redirecting = true;
    this.handleQueryParams();
    this.initCart();
  }

  handleQueryParams() {
    this.route.queryParamMap.subscribe((paramAsMap: ParamMap) => {
      this.clientId = paramAsMap.get("cid");
      this.page = paramAsMap.get("p");
      if (this.redirecting) {
        this.redirecting = !this.redirecting;
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
      } else {
        this.initAccount(paramAsMap);
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
    const appCode = params.get("state") || "123"; // code for grocery
    if (appCode) {
      this.context.set("appCode", appCode);
    }
    if (!tokenId) {
      this.authSvc.getToken().then((tokenId) => {
        if (tokenId) {
          this.authSvc.login(tokenId);
        }
      });
    } else {
      this.authSvc.login(tokenId);
    }
    this.authSvc.getAccount().subscribe((account) => {
      this.account = account;
    });
    // this.authSvc.authState.subscribe((isLoggedIn: boolean) => {
    //   if (!isLoggedIn) {
    //     this.showAlert("Notice", "Login failed", "OK");
    //   }
    // });
  }

  handleCreditByWeChat(params: ParamMap) {
    if (this.clientId) {
      // trusting clientId from query param is dangerous
      // a mailcious attacker can impersonate other user with acquired clientId
    } else {
      this.authSvc.updateData();
      this.router.navigate(["/tabs/my-account/transaction-history"]);
    }
  }

  handleWeChatPay(params: ParamMap) {
    if (this.clientId) {
      // trusting clientId from query param is dangerous
      // a mailcious attacker can impersonate other user with acquired clientId
    } else {
      this.authSvc.updateData();
      this.router.navigate(["/tabs/my-account/order-history"]);
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

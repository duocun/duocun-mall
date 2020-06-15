import { Component, OnInit, OnDestroy } from "@angular/core";
import { CartService } from "src/app/services/cart/cart.service";
import { CartInterface } from "src/app/models/cart.model";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth/auth.service";
import { AccountInterface } from "src/app/models/account.model";
import { AlertController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { ContextService } from "src/app/services/context/context.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit, OnDestroy {
  cart: CartInterface;
  clientId: string;
  page: string;
  account: AccountInterface;
  /**
   * prevents permanent redirecting
   * Ionic tab routing does not clear query params
   */
  redirecting: boolean;
  private unsubscribe$ = new Subject<void>();
  constructor(
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private authSvc: AuthService,
    private alert: AlertController,
    private translator: TranslateService,
    private context: ContextService
  ) {}

  ngOnInit() {
    this.redirecting = true;
    // this.handleQueryParams();
    this.initCart();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handleQueryParams() {
    this.route.queryParamMap
      // .pipe(takeUntil(this.unsubscribe$))
      .subscribe((paramAsMap: ParamMap) => {
        console.log("home page query param subscription");
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
    this.cartService
      .getCart()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((cart: CartInterface) => {
        console.log("home page cart subscription");
        this.cart = cart;
      });
  }

  async initAccount(params: ParamMap) {
    const tokenId: string = params.get("token");
    console.log("token", tokenId);
    const appCode = params.get("state") || "123"; // code for grocery
    if (appCode) {
      this.context.set("appCode", appCode);
    }
    if (!tokenId) {
      this.authSvc.getToken().then(async (tokenId) => {
        if (tokenId) {
          console.log("login");
          await this.authSvc.login(tokenId);
        }
      });
    } else {
      console.log("login");
      await this.authSvc.login(tokenId);
    }
    this.authSvc
      .getAccount()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((account) => {
        this.account = account;
      });
    // this.authSvc.authState.subscribe((isLoggedIn: boolean) => {
    //   if (!isLoggedIn) {
    //     this.showAlert("Notice", "Login failed", "OK");
    //   }
    // });
  }

  async handleCreditByWeChat(params: ParamMap) {
    if (this.clientId) {
      // trusting clientId from query param is dangerous
      // a mailcious attacker can impersonate other user with acquired clientId
    } else {
      await this.authSvc.updateData();
      this.router.navigate(["/tabs/my-account/transaction-history"]);
    }
  }

  async handleWeChatPay(params: ParamMap) {
    if (this.clientId) {
      // trusting clientId from query param is dangerous
      // a mailcious attacker can impersonate other user with acquired clientId
    } else {
      await this.authSvc.updateData();
      this.router.navigate(["/tabs/my-account/order-history"]);
    }
  }

  showAlert(header, message, button) {
    this.translator
      .get([header, message, button])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((dict) => {
        console.log("home page lang subscription");
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

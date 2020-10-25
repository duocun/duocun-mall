import { Component } from "@angular/core";

import { Platform, ToastController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { TranslateService } from "@ngx-translate/core";
import { Storage } from "@ionic/storage";
import { environment } from "src/environments/environment";
import { AccountInterface } from "src/app/models/account.model";
import * as queryString from "query-string";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth/auth.service";
import { AlertController } from "@ionic/angular";
import { ContextService } from "src/app/services/context/context.service";
import { SocketService } from "./services/socket/socket.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent {
  clientId: string;
  page: string;
  /**
   * prevents permanent redirecting
   * Ionic tab routing does not clear query params
   */
  redirecting: boolean;
  account: AccountInterface;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translator: TranslateService,
    private stroage: Storage,
    private router: Router,
    private authSvc: AuthService,
    private context: ContextService,
    private alert: AlertController,
    private toast: ToastController,
    private socketio: SocketService
  ) {
    this.initializeApp();
    this.stroage.get(environment.storageKey.lang).then((lang: any) => {
      if (lang === "en" || lang === "zh") {
        this.translator.use(lang);
      } else {
        this.stroage.set(environment.storageKey.lang, environment.defaultLang);
        this.translator.use(environment.defaultLang);
      }
    });

    this.socketio.receivedMessage.subscribe((data) => {
      if (!this.socketio.tabOpened) {
        this.presentToast();
      }
    });
  }

  async presentToast() {
    const original_word = "A message from customer service arrived";
    this.translator.get([original_word]).subscribe(async (dict) => {
      const toast = await this.toast.create({
        message: dict[original_word],
        duration: 2000
      });
      toast.present();
    });
  }

  initializeApp() {
    this.redirecting = true;
    this.handleQueryParams();
    console.log(queryString.parse(location.search));
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  handleQueryParams() {
    const paramAsMap = queryString.parse(location.search);
    console.log("paramAsMap", paramAsMap);
    console.log("home page query param subscription");
    this.clientId = `${paramAsMap["cid"] || ""}`;
    this.page = `${paramAsMap["p"] || ""}`;
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
  }
  async handleCreditByWeChat(params: object) {
    if (this.clientId) {
      // trusting clientId from query param is dangerous
      // a mailcious attacker can impersonate other user with acquired clientId
    } else {
      await this.authSvc.updateData();
      this.router.navigate(["/tabs/my-account/transaction-history"]);
    }
  }

  async handleWeChatPay(params: object) {
    if (this.clientId) {
      // trusting clientId from query param is dangerous
      // a mailcious attacker can impersonate other user with acquired clientId
    } else {
      await this.authSvc.updateData();
      this.router.navigate(["/tabs/my-account/order-history"]);
    }
  }

  async initAccount(params: object) {
    const tokenId: string = params["token"] || "";
    console.log("token", tokenId);
    const appCode = params["state"] || "123"; // code for grocery
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
    this.authSvc.getAccount().subscribe((account) => {
      this.account = account;
      if (this.account && (!this.account.phone || !this.account.verified)) {
        this.showAlert("Notice", "Please verify your phone number", "OK");
        this.router.navigate(["/tabs/my-account/setting"]);
      }
    });
    // this.authSvc.authState.subscribe((isLoggedIn: boolean) => {
    //   if (!isLoggedIn) {
    //     this.showAlert("Notice", "Login failed", "OK");
    //   }
    // });
  }
  showAlert(header, message, button) {
    this.translator.get([header, message, button]).subscribe((dict) => {
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

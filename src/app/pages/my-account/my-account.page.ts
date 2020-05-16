import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { AccountInterface } from "src/app/models/account.model";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "src/environments/environment";
import { Storage } from "@ionic/storage";
import { ContextService } from "src/app/services/context/context.service";
import { ActivatedRoute } from "@angular/router";
import { IonSelect } from "@ionic/angular";
@Component({
  selector: "app-my-account",
  templateUrl: "./my-account.page.html",
  styleUrls: ["./my-account.page.scss"]
})
export class MyAccountPage implements OnInit, AfterViewInit {
  account: AccountInterface;
  lang: string;
  appCode: string;
  @ViewChild("selectLang", { static: false }) selectLangRef: IonSelect;
  constructor(
    private authSvc: AuthService,
    private translator: TranslateService,
    private storage: Storage,
    private context: ContextService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.authSvc.getAccount().subscribe((account) => (this.account = account));
    this.lang = this.translator.currentLang;
    this.translator.onLangChange.subscribe((locale: { lang: string }) => {
      this.lang = locale.lang;
    });
    this.context.getContext().subscribe((context) => {
      this.appCode = context.get("appCode");
    });
  }
  ngAfterViewInit() {
    this.route.queryParams.subscribe((query) => {
      if (query.action === "change-lang") {
        if (this.selectLangRef) {
          this.selectLangRef.open();
        }
      }
    });
  }
  handleLangChange(event) {
    const lang = event.detail.value;
    this.storage.set(environment.storageKey.lang, lang);
    this.translator.use(lang);
    window.location.href = this.getUrlWithoutQueryString();
  }
  handleLangCancel() {
    window.location.href = this.getUrlWithoutQueryString();
  }
  getUrlWithoutQueryString() {
    return [location.protocol, "//", location.host, location.pathname].join("");
  }
}

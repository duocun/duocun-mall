import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { AccountInterface } from "src/app/models/account.model";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "src/environments/environment";
import { Storage } from "@ionic/storage";
import { ContextService } from "src/app/services/context/context.service";
import { ActivatedRoute } from "@angular/router";
import { IonSelect } from "@ionic/angular";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
@Component({
  selector: "app-my-account",
  templateUrl: "./my-account.page.html",
  styleUrls: ["./my-account.page.scss"]
})
export class MyAccountPage implements OnInit, AfterViewInit, OnDestroy {
  account: AccountInterface;
  lang: string;
  appCode: string;
  @ViewChild("selectLang", { static: false }) selectLangRef: IonSelect;
  private unsubscribe$ = new Subject<void>();
  constructor(
    private authSvc: AuthService,
    private translator: TranslateService,
    private storage: Storage,
    private context: ContextService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.authSvc
      .getAccount()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((account) => {
        console.log("my account page account subscription");
        this.account = account;
      });
    this.lang = this.translator.currentLang;
    this.translator.onLangChange
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((locale: { lang: string }) => {
        console.log("my account page lang subscription");
        this.lang = locale.lang;
      });
    this.context
      .getContext()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((context) => {
        console.log("my account page appCode subscription");
        this.appCode = context.get("appCode");
      });
  }
  ngAfterViewInit() {
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((query) => {
        console.log("my accont page query param subscription");
        if (query.action === "change-lang") {
          if (this.selectLangRef) {
            this.selectLangRef.open();
          }
        }
      });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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

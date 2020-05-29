import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { AccountInterface } from "src/app/models/account.model";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "language-button",
  templateUrl: "./language-button.component.html",
  styleUrls: ["./language-button.component.scss"]
})
export class LanguageButtonComponent implements OnInit, OnDestroy {
  account: AccountInterface;
  lang: string;
  unsubscribe$: Subject<void>;
  constructor(
    private authSvc: AuthService,
    private translator: TranslateService
  ) {
    this.unsubscribe$ = new Subject<void>();
  }

  ngOnInit() {
    this.authSvc
      .getAccount()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((account) => {
        this.account = account;
      });
    this.lang = this.translator.currentLang || "en";
    this.translator.onLangChange
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((event) => {
        this.lang = event.lang;
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

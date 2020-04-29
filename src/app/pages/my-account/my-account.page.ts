import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth/auth.service";
import { AccountInterface } from "src/app/models/account.model";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "src/environments/environment";
import { Storage } from "@ionic/storage";
import { AlertController } from "@ionic/angular";
@Component({
  selector: "app-my-account",
  templateUrl: "./my-account.page.html",
  styleUrls: ["./my-account.page.scss"]
})
export class MyAccountPage implements OnInit {
  account: AccountInterface;
  lang: string;
  constructor(
    private authSvc: AuthService,
    private translator: TranslateService,
    private storage: Storage,
    private alert: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.authSvc.getAccount().subscribe((account) => (this.account = account));
    this.lang = this.translator.currentLang;
    this.translator.onLangChange.subscribe((locale: { lang: string }) => {
      this.lang = locale.lang;
    });
  }
  handleLangChange(event) {
    const lang = event.detail.value;
    this.storage.set(environment.storageKey.lang, lang);
    this.translator.use(lang);
    window.location.reload();
  }
}

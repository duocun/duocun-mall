import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { TranslateService } from "@ngx-translate/core";
import { Storage } from "@ionic/storage";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translator: TranslateService,
    private stroage: Storage
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
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}

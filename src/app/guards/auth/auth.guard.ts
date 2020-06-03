import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { AuthService } from "src/app/services/auth/auth.service";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  alerted: boolean;
  constructor(
    public auth: AuthService,
    private router: Router,
    private alert: AlertController,
    private translator: TranslateService
  ) {
    this.alerted = false;
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise((resolve) => {
      this.auth.authState.subscribe((isLoggedIn) => {
        if (isLoggedIn) {
          resolve(true);
        } else {
          if (!this.alerted) {
            // this.showAlert();
            this.alerted = true;
          }
          this.router.navigate(["/tabs/login"], {
            queryParams: { returnUrl: state.url }
          });
          resolve(false);
        }
      });
    });
  }
  showAlert() {
    const header = "Notice";
    const message = "You are not logged in";
    const button = "OK";
    this.translator.get([header, message, button]).subscribe((dict) => {
      this.alert
        .create({
          header: dict[header],
          message: dict[message],
          buttons: [dict[button]]
        })
        .then((alert) => {
          alert.present();
        });
    });
  }
}

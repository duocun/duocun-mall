import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { LocationService } from "src/app/services/location/location.service";
import { AlertController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { AuthGuard } from "../auth/auth.guard";
import { AuthService } from "src/app/services/auth/auth.service";

@Injectable({
  providedIn: "root"
})
export class LocationGuard implements CanActivate {
  constructor(
    private locSvc: LocationService,
    private alert: AlertController,
    private router: Router,
    private translator: TranslateService,
    private authSvc: AuthService,
    private authGuard: AuthGuard
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return this.authGuard.canActivate(next, state).then((canActivate) => {
      if (!canActivate) {
        return false;
      }
      if (!this.authSvc.account.phone) {
        this.showAlert("Notice", "Please input phone number", "OK");
        this.router.navigate(["/tabs/my-account/setting"], {
          queryParams: { redirectUrl: state.url }
        });
        return false;
      }
      if (this.locSvc.location || this.locSvc.location === undefined) {
        return true;
      } else {
        this.showAlert();
        this.router.navigate(["/tabs/my-account/setting"], {
          queryParams: { redirectUrl: state.url }
        });
        return false;
      }
    });
  }
  showAlert(
    header = "Notice",
    message = "Please select delivery address",
    button = "OK"
  ) {
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

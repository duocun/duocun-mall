import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import { LocationService } from "src/app/services/location/location.service";
import { AlertController } from "@ionic/angular";
import { Observable } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: "root"
})
export class LocationGuard implements CanActivate {
  constructor(
    private locSvc: LocationService,
    private alert: AlertController,
    private router: Router,
    private translator: TranslateService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Observable((observer) => {
      if (this.locSvc.location || this.locSvc.location === undefined) {
        observer.next(true);
      } else {
        this.showAlert();
        this.router.navigate(["/tabs/my-account/setting"], {
          queryParams: { redirectUrl: state.url }
        });
        observer.next(false);
      }
    });
  }
  showAlert() {
    const header = "Notice";
    const message = "Please select delivery address";
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

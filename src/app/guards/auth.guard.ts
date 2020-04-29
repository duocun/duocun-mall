import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "src/app/services/auth/auth.service";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(
    public auth: AuthService,
    private router: Router,
    private alert: AlertController,
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
      this.auth.authState.subscribe((isLoggedIn) => {
        if (isLoggedIn) {
          observer.next(true);
        } else {
          this.showAlert();
          this.router.navigate(["/"], {
            queryParams: { returnUrl: state.url }
          });
          observer.next(false);
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

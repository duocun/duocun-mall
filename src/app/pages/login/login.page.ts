import { Component, OnInit, OnDestroy } from "@angular/core";
import { ApiService } from "src/app/services/api/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AlertController } from "@ionic/angular";
import { AuthService } from "src/app/services/auth/auth.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { environment } from "src/environments/environment";
declare const gapi: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit, OnDestroy {
  isOtpSent: boolean;
  failedCount: number;
  processing: boolean;
  phone: string;
  otp: string;
  returnUrl: string;
  private unsubscribe$ = new Subject<void>();
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private translator: TranslateService,
    private alert: AlertController,
    private authSvc: AuthService
  ) {}

  ngOnInit() {
    this.isOtpSent = false;
    this.failedCount = 0;
    this.processing = false;
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    this.initGoogleAuth();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initGoogleAuth() {
    gapi.load("auth2", () => {
      const auth2 = gapi.auth2.init({
        client_id: environment.googleAuthClientId,
        cookiepolicy: "single_host_origin"
      });
      auth2.attachClickHandler(
        document.getElementById("googleLoginButton"),
        {},
        (googleUser) => {
          const profile = googleUser.getBasicProfile();
          const userInfo = {
            token: googleUser.getAuthResponse().id_token,
            googleUserId: profile.getId()
          };
          this.api.post("Accounts/googleLogin", userInfo).then((observable) => {
            observable
              .toPromise()
              .then((resp: { code: string; token: string }) => {
                if (resp.code === "success") {
                  this.authSvc.login(resp.token).then((account) => {
                    if (account) {
                      if (!account.phone || !account.verified) {
                        // this.showAlert(
                        //   "Notice",
                        //   "Please verify your phone number",
                        //   "OK"
                        // );
                        // this.router.navigate(["/tabs/my-account/setting"]);
                      } else {
                        this.showAlert("Notice", "Login successful", "OK");
                        if (this.returnUrl) {
                          this.router.navigate([this.returnUrl]);
                        } else {
                          this.router.navigate(["/tabs/browse"]);
                        }
                      }
                    } else {
                      this.showAlert("Notice", "Login failed", "OK");
                    }
                  });
                } else {
                  this.showAlert("Notice", "Login failed", "OK");
                }
              });
          });
        },
        (error) => {
          console.error(error);
          this.showAlert("Notice", "Login failed", "OK");
        }
      );
    });
  }

  handleSendVerificationCode() {
    this.api
      .post("Accounts/sendOTPCode", {
        phone: this.phone
      })
      .then((observable) => {
        observable
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((resp: { code: string; message?: string }) => {
            console.log("login page send otp code subscription");
            if (resp.code === "success") {
              this.showAlert("Notice", "Verification code sent", "OK");
            } else {
              if (resp.message == "no such account") {
                const header = "Notice";
                const message =
                  "The phone number is not registered. Please create an account first.";
                const cancel = "Cancel";
                const ok = "OK";
                this.translator
                  .get([header, message, cancel, ok])
                  .subscribe(async (dict: any) => {
                    const alert = await this.alert.create({
                      header: dict[header],
                      message: dict[message],
                      buttons: [
                        {
                          text: dict[cancel],
                          role: "cancel",
                          cssClass: "secondary"
                        },
                        {
                          text: dict[ok],
                          handler: () => {
                            this.router.navigate(["/tabs/register"], {
                              state: {
                                phone: this.phone
                              },
                              replaceUrl: true
                            });
                          }
                        }
                      ]
                    });
                    alert.present();
                  });
              } else {
                this.showAlert(
                  "Notice",
                  "Verification code was not sent",
                  "OK"
                );
              }
            }
            this.processing = false;
          });
      });
  }

  handleSignIn() {
    this.api
      .post("Accounts/loginByPhone", {
        phone: this.phone,
        verificationCode: this.otp
      })
      .then((observable) => {
        observable
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((resp: { code: string; token: string }) => {
            console.log("login page loginbyphone subscription");
            if (resp.code === "success") {
              this.authSvc.login(resp.token).then((account) => {
                if (account) {
                  this.showAlert("Notice", "Login successful", "OK");
                  if (this.returnUrl) {
                    this.router.navigate([this.returnUrl]);
                  } else {
                    this.router.navigate(["/tabs/browse"]);
                  }
                } else {
                  this.showAlert("Notice", "Login failed", "OK");
                }
              });
            } else {
              this.showAlert(
                "Notice",
                "Login failed. Please check your verification code and try again",
                "OK"
              );
            }
          });
      });
  }

  showAlert(header, message, button) {
    this.translator
      .get([header, message, button])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((dict) => {
        console.log("login page lang subscription");
        this.alert
          .create({
            header: dict[header],
            message: dict[message],
            buttons: [dict[button]]
          })
          .then((alert) => alert.present());
      });
  }

  isValidPhoneNumber() {
    if (!this.phone) {
      return false;
    }
    if (this.phone.length < 5 || this.phone.length > 10) {
      return false;
    }
    return true;
  }
}

import { Component, OnInit, OnDestroy } from "@angular/core";
import { RegisterAccountInterface } from "src/app/models/account.model";
import { ApiService } from "src/app/services/api/api.service";
import { TranslateService } from "@ngx-translate/core";
import { AlertController } from "@ionic/angular";
import { AuthService } from "src/app/services/auth/auth.service";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { SeoService } from "src/app/services/seo/seo.service";
declare const gapi: any;

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"]
})
export class RegisterPage implements OnInit, OnDestroy {
  processing: boolean;
  model: RegisterAccountInterface;
  tosAgreed: boolean;
  isOtpSent: boolean;
  otpSentCount: number;
  lang: string;
  private unsubscribe$ = new Subject<void>();
  constructor(
    private api: ApiService,
    private translator: TranslateService,
    private alert: AlertController,
    private authSvc: AuthService,
    private router: Router,
    private seo: SeoService
  ) {
    this.model = {
      phone: "",
      username: "",
      verificationCode: ""
    };
    this.tosAgreed = false;
    this.processing = false;
    this.isOtpSent = false;
    this.otpSentCount = 0;
  }

  ngOnInit() {
    this.initGoogleAuth();
    this.router.events.subscribe((event) => {
      try {
        const phone = this.router.getCurrentNavigation().extras.state.phone;
        if (phone) {
          this.model.phone = phone;
        }
      } catch (e) {}
    });
    this.lang = this.translator.currentLang;
    this.translator.onLangChange.subscribe((lang) => {
      this.lang = lang.lang;
    });
    this.seo.setTitle("注册");
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.seo.setDefaultSeo();
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
            googleUserId: profile.getId(),
            username: profile.getName(),
            imageurl: profile.getImageUrl()
          };
          this.api
            .post("Accounts/googleSignUp", userInfo)
            .then((observable) => {
              observable
                .toPromise()
                .then(
                  (res: { code: string; message?: string; token?: string }) => {
                    console.log("register page register subscription");
                    if (res.code === "success") {
                      this.authSvc.login(res.token).then((account) => {
                        if (account) {
                          if (account.phone && account.verified) {
                            this.showAlert(
                              "Notice",
                              "Registered successfully",
                              "OK"
                            );
                            this.router.navigate(["/tabs/browse"]);
                          } else {
                            this.showAlert(
                              "Notice",
                              "Please verify your phone number",
                              "OK"
                            );
                            this.router.navigate(["/tabs/my-account/setting"]);
                          }
                        } else {
                          this.showAlert("Notice", "Registration failed", "OK");
                        }
                      });
                    } else {
                      this.showAlert("Notice", "Registration failed", "OK");
                    }
                  }
                );
            });
        },
        (error) => {
          console.error(error);
          // this.showAlert("Notice", "Registration failed", "OK");
        }
      );
    });
  }

  isValidPhone() {
    if (!this.model.phone) {
      return false;
    }
    if (this.model.phone.length < 5 || this.model.phone.length > 10) {
      return false;
    }
    return true;
  }

  isValidForm() {
    return this.isValidPhone() && this.model.verificationCode && this.tosAgreed;
  }

  handleSendOTP() {
    this.processing = true;
    this.api
      .post("Accounts/registerTempAccount", {
        phone: this.model.phone
      })
      .then((observable) => [
        observable
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((res: { code: string; message?: string }) => {
            if (res.code === "success") {
              this.showAlert("Notice", "Verification code sent", "OK");
            } else {
              if (res.message === "phone number already exists") {
                this.showAlert("Notice", "Phone number already exists", "OK");
              } else {
                this.showAlert(
                  "Notice",
                  "Verification code was not sent",
                  "OK"
                );
              }
            }
          })
      ])
      .catch((e) => {
        console.error(e);
        this.showAlert("Notice", "Verification code was not sent", "OK");
      })
      .finally(() => {
        this.isOtpSent = true;
        this.otpSentCount++;
        this.processing = false;
      });
  }

  handleSignUp() {
    this.processing = true;
    this.api
      .post("Accounts/register", this.model)
      .then((observable) => {
        observable
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(
            (res: { code: string; message?: string; token?: string }) => {
              console.log("register page register subscription");
              if (res.code === "success") {
                this.authSvc.login(res.token).then((account) => {
                  if (account) {
                    this.showAlert("Notice", "Registered successfully", "OK");
                    this.router.navigate(["/tabs/browse"]);
                  } else {
                    this.showAlert("Notice", "Registration failed", "OK");
                  }
                });
              } else {
                this.showAlert(
                  "Notice",
                  "Registration failed. Please check your verification code and try again",
                  "OK"
                );
              }
            }
          );
      })
      .catch((e) => {
        console.error(e);
        this.showAlert("Notice", "Registration failed", "OK");
      })
      .finally(() => {
        this.processing = false;
      });
  }

  showAlert(header, message, button) {
    this.translator
      .get([header, message, button])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((dict) => {
        console.log("register page lang subscription");
        this.alert
          .create({
            header: dict[header],
            message: dict[message],
            buttons: [dict[button]]
          })
          .then((alert) => alert.present());
      });
  }
}

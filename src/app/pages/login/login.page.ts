import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AlertController } from "@ionic/angular";
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  isOtpSent: boolean;
  failedCount: number;
  processing: boolean;
  phone: string;
  otp: string;
  returnUrl: string;
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
  }

  handleSendVerificationCode() {
    this.api
      .post("Accounts/sendOTPCode", {
        phone: this.phone
      })
      .then((observable) => {
        observable.subscribe((resp: { code: string; message?: string }) => {
          if (resp.code === "success") {
            this.showAlert("Notice", "Verification code sent", "OK");
          } else {
            this.showAlert("Notice", "Verification code was not sent", "OK");
          }
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
        observable.subscribe((resp: { code: string, token: string }) => {
          if (resp.code === "success") {
            this.authSvc.login(resp.token);
            if (this.returnUrl) {
              this.router.navigate([this.returnUrl]);
            } else {
              this.router.navigate(["/tabs/browse"]);
            }
          } else {
            this.showAlert("Notice", "Login failed", "OK");
          }
        });
      });
  }

  showAlert(header, message, button) {
    this.translator.get([header, message, button]).subscribe((dict) => {
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

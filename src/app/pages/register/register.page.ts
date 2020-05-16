import { Component, OnInit } from "@angular/core";
import { RegisterAccountInterface } from "src/app/models/account.model";
import { ApiService } from "src/app/services/api/api.service";
import { TranslateService } from "@ngx-translate/core";
import { AlertController } from "@ionic/angular";
import { AuthService } from "src/app/services/auth/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"]
})
export class RegisterPage implements OnInit {
  processing: boolean;
  model: RegisterAccountInterface;
  tosAgreed: boolean;
  isOtpSent: boolean;
  otpSentCount: number;
  constructor(
    private api: ApiService,
    private translator: TranslateService,
    private alert: AlertController,
    private authSvc: AuthService,
    private router: Router
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

  ngOnInit() {}

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
        observable.subscribe((res: { code: string; message?: string }) => {
          if (res.code === "success") {
            this.showAlert("Notice", "Verification code sent", "OK");
          } else {
            if (res.message === "phone number already exists") {
              this.showAlert("Notice", "Phone number already exists", "OK");
            } else {
              this.showAlert("Notice", "Verification code was not sent", "OK");
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
        observable.subscribe(
          (res: { code: string; message?: string; token?: string }) => {
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
              this.showAlert("Notice", "Registration failed", "OK");
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
}
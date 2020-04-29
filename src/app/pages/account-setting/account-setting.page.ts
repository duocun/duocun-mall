import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { AccountInterface } from "src/app/models/account.model";
import { ApiService } from "src/app/services/api/api.service";
import { TranslateService } from "@ngx-translate/core";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-account-setting",
  templateUrl: "./account-setting.page.html",
  styleUrls: ["./account-setting.page.scss"]
})
export class AccountSettingPage implements OnInit {
  account: AccountInterface;
  model: AccountInterface;
  constructor(
    private authSvc: AuthService,
    private api: ApiService,
    private alert: AlertController,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.authSvc.getAccount().subscribe((account) => {
      this.account = account;
      this.model = { ...account };
    });
  }

  handleSave() {
    if (!this.model.phone) {
      this.showAlert("Notice", "Please input phone number", "OK");
      return;
    }
    this.model.phone = this.sanitizePhoneNumber(this.model.phone);
    this.api
      .patch(`Accounts`, {
        filter: {
          _id: this.account._id
        },
        data: {
          phone: this.model.phone,
          verified: true
        }
      })
      .then((observable) => {
        observable.subscribe((resp: any) => {
          if (resp.ok === 1) {
            this.showAlert("Notice", "Saved successfully", "OK");
            this.authSvc.updateData();
          } else {
            this.showAlert("Notice", "Save failed", "OK");
          }
        });
      });
  }

  sanitizePhoneNumber(phone: string) {
    phone = phone.substring(0, 2) === "+1" ? phone.substring(2) : phone;
    phone = phone.match(/\d+/g).join("");
    return phone;
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

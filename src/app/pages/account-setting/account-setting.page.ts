import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { AccountInterface } from "src/app/models/account.model";
import { ApiService } from "src/app/services/api/api.service";
import { TranslateService } from "@ngx-translate/core";
import { AlertController } from "@ionic/angular";
import { LocationService } from "src/app/services/location/location.service";
import { LocationInterface } from "src/app/models/location.model";
import { Router, ActivatedRoute } from "@angular/router";
import { CartService } from "src/app/services/cart/cart.service";
import { environment } from "src/environments/environment";
import { Storage } from "@ionic/storage";
@Component({
  selector: "app-account-setting",
  templateUrl: "./account-setting.page.html",
  styleUrls: ["./account-setting.page.scss"]
})
export class AccountSettingPage implements OnInit {
  account: AccountInterface;
  model: AccountInterface;
  location: LocationInterface;
  redirectUrl: string;
  saveLocation: boolean;
  processing: boolean;
  constructor(
    private authSvc: AuthService,
    private api: ApiService,
    private alert: AlertController,
    private translator: TranslateService,
    private loc: LocationService,
    private router: Router,
    private cart: CartService,
    private route: ActivatedRoute,
    private storage: Storage
  ) {
    this.redirectUrl = "";
    this.saveLocation = false;
    this.processing = false;
  }

  ngOnInit() {
    this.authSvc.getAccount().subscribe((account) => {
      this.account = account;
      this.model = { ...account };
      this.model.verificationCode = "";
    });
    this.storage
      .get(environment.storageKey.location)
      .then((location: LocationInterface) => {
        if (location) {
          this.saveLocation = true;
        } else {
          this.saveLocation = false;
        }
      });
    this.loc.getLocation().subscribe((location: LocationInterface) => {
      this.location = location;
    });
    this.route.queryParams.subscribe((params) => {
      this.redirectUrl = params.redirectUrl || "";
    });
  }

  handleSave() {
    if (!this.model.phone) {
      this.showAlert("Notice", "Please input phone number", "OK");
      return;
    }
    this.processing = true;

    this.model.phone = this.sanitizePhoneNumber(this.model.phone);
    if (this.model.phone == this.account.phone) {
      this.saveProfile();
    } else {
      this.api
        .post("Accounts/verifyCode", {
          newPhone: this.model.phone,
          code: this.model.verificationCode
        })
        .then((observable) => {
          observable.subscribe((resp: { code: string }) => {
            if (resp.code === "success") {
              this.saveProfile();
            } else {
              this.showAlert("Notice", "Please verify your phone number", "OK");
            }
            this.processing = false;
          });
        })
        .finally(() => {
          this.processing = false;
        });
    }
  }

  handleSendVerificationCode() {
    this.api
      .post("Accounts/sendVerificationCode", {
        phone: this.model.phone
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

  checkDeliveryRange() {
    this.api
      .get("/Areas/G/my", {
        lat: this.location.lat,
        lng: this.location.lng
      })
      .then((observable) => {
        observable.subscribe((resp: { code: string; data: any }) => {
          if (resp.code !== "success") {
            this.showAlert(
              "Notice",
              "Your address is out of delivery range",
              "OK"
            );
          }
        });
      });
  }

  saveProfile() {
    this.api
      .post("Accounts/saveProfile", {
        location: this.saveLocation ? this.location : null,
        secondPhone: this.model.secondPhone
      })
      .then((observable) => {
        observable.subscribe((resp: { code: string }) => {
          this.processing = false;
          if (resp.code === "success") {
            this.handleSaveProfileSuccess();
          } else {
            this.showAlert("Notice", "Save failed", "OK");
          }
        });
      })
      .catch((e) => {
        console.error(e);
        this.processing = false;
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

  handleLocationSelect(event: {
    address: string;
    location: LocationInterface;
  }) {
    this.location = event.location;
    this.location.address = event.address;
    this.cart.clearCart();
    this.checkDeliveryRange();
  }

  handleSaveProfileSuccess() {
    if (this.location) {
      this.loc.setLocation(
        this.location,
        this.location.address,
        this.saveLocation
      );
    }
    this.showAlert("Notice", "Saved successfully", "OK");
    this.authSvc.updateData();
    if (this.redirectUrl) {
      this.router.navigateByUrl(this.redirectUrl);
    } else {
      this.router.navigate(["/tabs/my-account"]);
    }
  }

  isValidPhoneNumber(phone: any) {
    if (!phone) {
      return false;
    }
    if (phone.length < 5 || phone.length > 10) {
      return false;
    }
    return true;
  }
}

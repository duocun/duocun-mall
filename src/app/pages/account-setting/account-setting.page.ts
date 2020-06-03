import { Component, OnInit, OnDestroy } from "@angular/core";
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
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
@Component({
  selector: "app-account-setting",
  templateUrl: "./account-setting.page.html",
  styleUrls: ["./account-setting.page.scss"]
})
export class AccountSettingPage implements OnInit, OnDestroy {
  account: AccountInterface;
  model: AccountInterface;
  location: LocationInterface;
  redirectUrl: string;
  saveLocation: boolean;
  processing: boolean;
  private unsubscribe$ = new Subject<void>();
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
    this.authSvc
      .getAccount()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((account) => {
        console.log("account setting page account subscription");
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
    this.loc
      .getLocation()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((location: LocationInterface) => {
        console.log("account setting page location subscription");
        this.location = location;
      });
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        console.log("account setting page query param subscription");
        this.redirectUrl = params.redirectUrl || "";
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handleSave() {
    if (!this.model.phone) {
      this.showAlert("Notice", "Please input phone number", "OK");
      return;
    }
    if (!this.location) {
      this.showAlert("Notice", "Please select delivery address", "OK");
      return;
    }
    this.processing = true;

    this.model.phone = this.sanitizePhoneNumber(this.model.phone);
    this.api
      .post("Accounts/saveProfile", {
        username: this.model.username,
        newPhone: this.model.phone,
        code: this.model.verificationCode,
        location: this.saveLocation ? this.location : null,
        secondPhone: this.model.secondPhone
      })
      .then((observable) => {
        observable
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((resp: { code: string; data: string }) => {
            if (resp.code === "success") {
              this.authSvc.login(resp.data).then(() => {
                this.handleSaveProfileSuccess();
                this.processing = false;
              });
            } else {
              this.showAlert("Notice", "Please verify your phone number", "OK");
            }
            this.processing = false;
          });
      })
      .catch((e) => {
        console.error(e);
        this.showAlert("Notice", "Save failed", "OK");
        this.processing = false;
      });
  }

  handleSendVerificationCode() {
    this.api
      .post("Accounts/sendVerificationCode", {
        phone: this.model.phone
      })
      .then((observable) => {
        observable
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((resp: { code: string; message?: string }) => {
            console.log(
              "account setting page send verification code subscription"
            );
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
        observable
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((resp: { code: string; data: any }) => {
            console.log("account setting page area subscription");
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

  sanitizePhoneNumber(phone: string) {
    phone = phone.substring(0, 2) === "+1" ? phone.substring(2) : phone;
    phone = phone.match(/\d+/g).join("");
    return phone;
  }

  showAlert(header, message, button) {
    this.translator
      .get([header, message, button])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((dict) => {
        this.alert
          .create({
            header: dict[header],
            message: dict[message],
            buttons: [dict[button]]
          })
          .then((alert) => alert.present());
      });
  }

  async handleLocationSelect(event: {
    address: string;
    location: LocationInterface;
  }) {
    this.location = event.location;
    this.location.address = event.address;
    this.cart.clearCart();
    await this.checkDeliveryRange();
  }

  handleLocationClear() {
    this.location = null;
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

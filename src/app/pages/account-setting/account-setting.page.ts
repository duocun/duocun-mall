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
  saveLocation: any;
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
  }

  ngOnInit() {
    this.authSvc.getAccount().subscribe((account) => {
      this.account = account;
      this.model = { ...account };
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
    this.loc.setLocation(
      this.location,
      this.location.address,
      this.saveLocation
    );
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
            if (this.redirectUrl) {
              this.router.navigateByUrl(this.redirectUrl);
            } else {
              this.router.navigate(["/tabs/my-account"]);
            }
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

  handleLocationSelect(event: {
    address: string;
    location: LocationInterface;
  }) {
    this.location = event.location;
    this.location.address = event.address;
    this.cart.clearCart();
  }
}

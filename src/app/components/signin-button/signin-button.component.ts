import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth/auth.service";

@Component({
  selector: "signin-button",
  templateUrl: "./signin-button.component.html",
  styleUrls: ["./signin-button.component.scss"]
})
export class SigninButtonComponent implements OnInit {
  @Input() account: any;
  constructor(private router: Router, private authSvc: AuthService) {}

  ngOnInit() {}

  openSigninDialog() {
    this.router.navigate(["/tabs/login"]);
  }

  logout() {
    this.authSvc.logout();
    window.location.href = "/tabs/browse";
  }

  myOrders() {
    this.router.navigate(["/tabs/my-account/order-history"], {
      replaceUrl: true
    });
  }

  myAccount() {
    this.router.navigate(["/tabs/my-account"], {
      replaceUrl: true
    });
  }
  myTransactions() {
    this.router.navigate(["/tabs/my-account/transaction-history"], {
      replaceUrl: true
    });
  }
  accountSetting() {
    this.router.navigate(["/tabs/my-account/setting"], {
      replaceUrl: true
    });
  }
}

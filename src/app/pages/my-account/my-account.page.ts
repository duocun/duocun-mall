import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { AccountInterface } from "src/app/models/account.model";

@Component({
  selector: "app-my-account",
  templateUrl: "./my-account.page.html",
  styleUrls: ["./my-account.page.scss"]
})
export class MyAccountPage implements OnInit {
  account: AccountInterface;
  constructor(private authSvc: AuthService) {}

  ngOnInit() {
    this.authSvc.getAccount().subscribe((account) => (this.account = account));
  }
}

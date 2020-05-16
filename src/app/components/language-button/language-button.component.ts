import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { AccountInterface } from "src/app/models/account.model";

@Component({
  selector: "language-button",
  templateUrl: "./language-button.component.html",
  styleUrls: ["./language-button.component.scss"]
})
export class LanguageButtonComponent implements OnInit {
  account: AccountInterface;
  constructor(private authSvc: AuthService) {}

  ngOnInit() {
    this.authSvc.getAccount().subscribe((account) => {
      this.account = account;
    });
  }
}

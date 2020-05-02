import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LocationInterface } from "src/app/models/location.model";
import { LocationService } from "src/app/services/location/location.service";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
@Component({
  selector: "app-browse",
  templateUrl: "./browse.page.html",
  styleUrls: ["./browse.page.scss"]
})
export class BrowsePage implements OnInit {
  location: LocationInterface;
  viewMode: string;
  constructor(
    private loc: LocationService,
    private alert: AlertController,
    private translator: TranslateService,
    private router: Router
  ) {
    this.viewMode = "merchant";
  }

  ngOnInit() {
    this.loc.getLocation().subscribe((location: LocationInterface) => {
      if (location === null) {
        this.showAlert();
        this.router.navigate(["/tabs/my-account/setting"]);
      }
    });
  }

  showAlert() {
    const header = "Notice";
    const message = "Please select delivery address";
    const button = "OK";
    this.translator.get([header, message, button]).subscribe((dict) => {
      this.alert
        .create({
          header: dict[header],
          message: dict[message],
          buttons: [dict[button]]
        })
        .then((alert) => {
          alert.present();
        });
    });
  }

  toggleViewMode(event) {
    console.log(event);
  }
}

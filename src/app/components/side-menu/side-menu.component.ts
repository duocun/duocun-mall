import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api/api.service";
import { PageTabInterface } from "src/app/models/page.model";

@Component({
  selector: "app-side-menu",
  templateUrl: "./side-menu.component.html",
  styleUrls: ["./side-menu.component.scss"]
})
export class SideMenuComponent implements OnInit {
  loading: boolean;
  tabs: Array<PageTabInterface>;
  constructor(private api: ApiService) {
    this.tabs = [];
    this.loading = true;
  }

  ngOnInit() {
    console.log("loadTabs");
    this.api
      .get("Pages/loadTabs")
      .then((observable) => {
        observable.subscribe(
          (resp: {
            code: string;
            data?: Array<PageTabInterface>;
            message?: string;
          }) => {
            if (resp.code === "success") {
              this.tabs = resp.data;
              this.loading = false;
            }
          }
        );
      })
      .catch((e) => {
        console.error(e);
        this.loading = false;
      });
  }
}

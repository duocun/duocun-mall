import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.page.html",
  styleUrls: ["./categories.page.scss"]
})
export class CategoriesPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  handleSearch(event) {
    if (event.detail.value) {
      this.router.navigate(["/tabs/browse/search"], {
        queryParams: { q: event.detail.value }
      });
    }
  }
}

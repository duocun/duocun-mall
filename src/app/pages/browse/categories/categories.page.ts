import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { SeoService } from "src/app/services/seo/seo.service";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.page.html",
  styleUrls: ["./categories.page.scss"]
})
export class CategoriesPage implements OnInit, OnDestroy {
  constructor(private router: Router, private seo: SeoService) {}

  ngOnInit() {
    this.seo.setTitle("分类");
  }

  ngOnDestroy() {
    this.seo.setDefaultSeo();
  }

  handleSearch(event) {
    if (event.detail.value) {
      this.router.navigate(["/tabs/browse/search"], {
        queryParams: { q: event.detail.value }
      });
    }
  }
}

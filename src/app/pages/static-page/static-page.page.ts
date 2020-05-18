import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/services/api/api.service";
import { PageInterface } from "src/app/models/page.model";
import { observable } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-static-page",
  templateUrl: "./static-page.page.html",
  styleUrls: ["./static-page.page.scss"]
})
export class StaticPage implements OnInit {
  loading: boolean;
  page: PageInterface;
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private translator: TranslateService
  ) {
    this.loading = true;
    this.page = null;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const slug = params.slug;
      if (!slug) {
        this.router.navigate(["tabs/browse"]);
        return;
      }
      this.loadPage(slug);
    });
  }
  loadPage(slug: string) {
    this.api.get(`Pages/page/${slug}`).then((observable) => {
      observable.subscribe((resp: { code: string; data: PageInterface }) => {
        if (resp.code === "success") {
          this.page = resp.data;
          this.loading = false;
        }
      });
    });
  }
  getContent() {
    if (!this.page) {
      return "";
    }
    if (this.translator.currentLang === "zh") {
      return this.page.content;
    }
    return this.page.contentEN || this.page.content || "";
  }
}

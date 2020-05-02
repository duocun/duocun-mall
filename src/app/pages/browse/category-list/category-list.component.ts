import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api/api.service";
import { CategoryInterface } from "src/app/models/category.model";

@Component({
  selector: "category-list",
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.scss"]
})
export class CategoryListComponent implements OnInit {
  loading: boolean;
  categories: Array<CategoryInterface>;
  constructor(private api: ApiService) {
    this.loading = true;
    this.categories = [];
  }

  ngOnInit() {
    this.api.get("Categories/G").then((observable) => {
      observable.subscribe((resp: { code: string; data: Array<any> }) => {
        if (resp.code === "success") {
          this.categories = resp.data;
        }
        this.loading = false;
      });
    });
  }
}

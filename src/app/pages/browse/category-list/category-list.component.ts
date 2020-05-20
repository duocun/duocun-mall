import { Component, OnInit, OnDestroy } from "@angular/core";
import { ApiService } from "src/app/services/api/api.service";
import { CategoryInterface } from "src/app/models/category.model";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
@Component({
  selector: "category-list",
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.scss"]
})
export class CategoryListComponent implements OnInit, OnDestroy {
  loading: boolean;
  categories: Array<CategoryInterface>;
  private unsubscribe$ = new Subject<void>();
  constructor(private api: ApiService) {
    this.loading = true;
    this.categories = [];
  }

  ngOnInit() {
    this.api.get("Categories/G").then((observable) => {
      observable
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((resp: { code: string; data: Array<any> }) => {
          console.log("category list category subscription");
          if (resp.code === "success") {
            this.categories = resp.data;
          }
          this.loading = false;
        });
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

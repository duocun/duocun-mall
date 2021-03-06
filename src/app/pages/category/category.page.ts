import { Component, OnInit, OnDestroy } from "@angular/core";
import { CategoryInterface } from "src/app/models/category.model";
import { ProductInterface } from "src/app/models/product.model";
import { ApiService } from "src/app/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LocationService } from "src/app/services/location/location.service";
import { LocationInterface } from "src/app/models/location.model";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SeoService } from "src/app/services/seo/seo.service";
import { AccountInterface } from "src/app/models/account.model";
import { AuthService } from "src/app/services/auth/auth.service";
import slugify from "slugify";
@Component({
  selector: "app-category",
  templateUrl: "./category.page.html",
  styleUrls: ["./category.page.scss"]
})
export class CategoryPage implements OnInit, OnDestroy {
  loading: boolean;
  category: CategoryInterface;
  products: Array<ProductInterface>;
  availableMerchantIds: Array<string>;
  location: LocationInterface;
  account: AccountInterface;
  private unsubscribe$ = new Subject<void>();
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private locSvc: LocationService,
    private seo: SeoService,
    private authSvc: AuthService
  ) {
    this.loading = true;
  }

  ngOnInit() {
    this.route.params.subscribe((params: { id: string }) => {
      const categoryId = params.id;
      this.authSvc.account$.subscribe((account: AccountInterface) => {
        this.account = account;
        if (this.account) {
          this.getAvailableMerchantIds().then(() => {
            this.api.get(`Categories/G/${categoryId}`).then((observable) => {
              observable
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(
                  (resp: { code: string; data: CategoryInterface }) => {
                    console.log("category page category subscription");
                    if (resp.code === "success") {
                      this.category = resp.data;
                      this.seo.setTitle(this.category.name);
                      this.getProducts();
                    }
                  }
                );
            });
          });
        } else {
          this.api.get(`Categories/G/${categoryId}`).then((observable) => {
            observable
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe((resp: { code: string; data: CategoryInterface }) => {
                console.log("category page category subscription");
                if (resp.code === "success") {
                  this.category = resp.data;
                  this.seo.setTitle(this.category.name);
                  this.getProducts();
                }
              });
          });
        }
      });
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.seo.setDefaultSeo();
  }

  async getAvailableMerchantIds() {
    return new Promise((resolve, reject) => {
      this.locSvc
        .getLocation()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((location) => {
          console.log("category page merchant ids subscription");
          this.location = location;
          if (!this.location) {
            resolve([]);
            return;
          }
          this.api
            .get("/Areas/G/my", {
              lat: this.location.lat,
              lng: this.location.lng
            })
            .then((observable) => {
              observable
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((resp: { code: string; data: any }) => {
                  console.log("category page area subscription");
                  if (resp.code === "success") {
                    this.api
                      .geth("MerchantSchedules/availableMerchants", {
                        areaId: resp.data._id
                      })
                      .then((merchantIds: Array<string>) => {
                        this.availableMerchantIds = merchantIds;
                        resolve(merchantIds);
                      });
                  } else {
                    reject(resp);
                  }
                });
            })
            .catch((e) => {
              reject(e);
            });
        });
    });
  }
  getProducts() {
    const query: { categoryId?: any; merchantId?: any } = {};
    query.categoryId = this.category._id;
    if (this.availableMerchantIds && this.availableMerchantIds.length) {
      query.merchantId = { $in: this.availableMerchantIds };
    }
    this.api
      .geth("Products", query, true, "filter")
      .then((resp: Array<ProductInterface>) => {
        this.products = resp;
        this.loading = false;
      });
  }
  onProductClick(product: ProductInterface) {
    if (product.nameEN) {
      this.router.navigate([
        "/tabs/browse/products",
        slugify(product.nameEN, {
          lower: true
        }),
        product._id
      ]);
    } else {
      this.router.navigate(["/tabs/browse/products", product._id]);
    }
  }
}

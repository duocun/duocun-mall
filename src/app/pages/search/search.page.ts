import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductInterface } from "src/app/models/product.model";
import { ApiService } from "src/app/services/api/api.service";
import { LocationService } from "src/app/services/location/location.service";
import { LocationInterface } from "src/app/models/location.model";
import { Subject } from "rxjs";
import { takeUntil, take } from "rxjs/operators";
import { SeoService } from "src/app/services/seo/seo.service";
import slugify from "slugify";
@Component({
  selector: "app-search",
  templateUrl: "./search.page.html",
  styleUrls: ["./search.page.scss"]
})
export class SearchPage implements OnInit, OnDestroy {
  search: string;
  loading: boolean;
  products: Array<ProductInterface>;
  availableMerchantIds: Array<string>;
  location: LocationInterface;
  bSearchOnTitle = false;
  title = "Search";

  private unsubscribe$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private locSvc: LocationService,
    private seo: SeoService
  ) {
    this.search = "";
    this.loading = true;
    if (window.innerWidth >= 992) {
      this.bSearchOnTitle = true;
      this.title = "";
    }
  }

  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        console.log("search page query param subscription");
        this.search = params.q || "";
        this.getAvailableMerchantIds().then(() => {
          this.getProducts();
        });
      });
    this.seo.setTitle("搜索");
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.seo.setDefaultSeo();
  }

  handleSearch(event) {
    this.search = event.detail.value;
    if (this.search) {
      this.getProducts();
    }
  }
  async getAvailableMerchantIds() {
    return new Promise((resolve, reject) => {
      this.locSvc
        .getLocation()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((location) => {
          console.log("search page location subscription");
          this.location = location;
          if (!this.location) {
            this.availableMerchantIds = [];
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
                  console.log("search page area subscription");
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
    const query: any = { name: { $regex: this.search } };
    if (this.availableMerchantIds && this.availableMerchantIds.length) {
      query.merchantId = { $in: this.availableMerchantIds };
    }
    this.api
      .get("Products", {
        query: JSON.stringify(query)
      })
      .then((observable) => {
        observable
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((resp: Array<ProductInterface>) => {
            console.log("search page product subscription");
            this.products = resp;
            this.loading = false;
          });
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

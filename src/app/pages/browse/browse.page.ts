import { Component, OnInit, OnDestroy } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LocationInterface } from "src/app/models/location.model";
import { LocationService } from "src/app/services/location/location.service";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { ApiService } from "src/app/services/api/api.service";
import { CategoryInterface } from "src/app/models/category.model";
import { ProductInterface } from "src/app/models/product.model";
import { getPictureUrl } from "src/app/models/product.model";
import { SeoService } from "src/app/services/seo/seo.service";
import { Subject } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";
import slugify from "slugify";

@Component({
  selector: "app-browse",
  templateUrl: "./browse.page.html",
  styleUrls: ["./browse.page.scss"]
})
export class BrowsePage implements OnInit, OnDestroy {
  location: LocationInterface;
  // viewMode: "segment" | "category-only";
  viewSegment: string;
  categories: Array<CategoryInterface>;
  selectedCategoryId: string;
  availableMerchantIds: Array<string>;
  products: Array<ProductInterface>;
  loading: boolean;
  search: string;
  page: number;
  pageSize = 12;
  categoryDisplayLimit = 20;
  scrollDisabled: boolean;
  outofRange: boolean;
  bSearchOnTitle: boolean = false;
  title = "Home_Title";
  private unsubscribe$ = new Subject<void>();
  constructor(
    private loc: LocationService,
    private alert: AlertController,
    private translator: TranslateService,
    private router: Router,
    private api: ApiService,
    private seo: SeoService
  ) {
    this.page = 0;
    this.viewSegment = "merchant";
    // this.viewMode = "category-only";
    this.categories = [];
    this.selectedCategoryId = "";
    this.availableMerchantIds = null;
    this.loading = true;
    this.scrollDisabled = false;
    this.products = [];
    this.outofRange = false;
    if (window.innerWidth >= 992) {
      this.pageSize = 15;
      this.bSearchOnTitle = true;
      this.title = "";
    }
  }
  ngOnInit() {
    this.seo.setDefaultSeo();
    this.loc
      .getLocation()
      .pipe(
        filter((location) => location !== undefined),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((location: LocationInterface) => {
        console.log("browse page location susbscription");
        this.location = location;
        this.getAvailableMerchantIds().then(() => {
          this.api.get("Categories/G").then((observable) => {
            observable
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe((resp: { code: string; data: Array<any> }) => {
                console.log("browse page category subscription");
                if (resp.code === "success") {
                  this.categories = resp.data;
                  this.page = 0;
                  this.loadData(null);
                } else {
                  this.loading = false;
                }
              });
          });
        });
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  showAlert() {
    const header = "Notice";
    const message = "Please select delivery address";
    const button = "OK";
    this.translator
      .get([header, message, button])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((dict) => {
        console.log("browse page language subscription");
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

  handleSearch(event) {
    const search = event.detail.value;
    this.search = "";
    event.target.value = "";
    if (event.detail.value) {
      this.router.navigate(["/tabs/browse/search"], {
        queryParams: { q: search }
      });
    } else {
      this.showAll();
    }
  }

  showAll() {
    this.page = 1;
    this.products = [];
    this.scrollDisabled = false;
    this.loading = true;
    this.selectedCategoryId = "";
    this.getProducts();
  }

  handleSelectCategory(category: CategoryInterface) {
    this.page = 1;
    this.scrollDisabled = false;
    this.products = [];
    this.loading = true;
    this.selectedCategoryId = category._id;
    this.getProducts();
  }

  getProducts(event = null) {
    const query: { categoryId?: any; merchantId?: any } = {};
    if (this.selectedCategoryId) {
      query.categoryId = this.selectedCategoryId;
    }
    if (this.availableMerchantIds && this.availableMerchantIds.length) {
      query.merchantId = { $in: this.availableMerchantIds };
    }
    this.api
      .geth(
        `Products/paginate/${this.page}/${this.pageSize}`,
        query,
        true,
        "filter"
      )
      .then(
        (resp: { code: string; data: Array<ProductInterface>; meta: any }) => {
          if (this.page === 1) {
            this.products = [];
          }
          if (this.products.length < this.page * this.pageSize) {
            this.products = [...this.products, ...resp.data];
          }
          this.loading = false;
          if (event) {
            event.target.complete();
            if (!resp.data || !resp.data.length) {
              this.scrollDisabled = true;
            }
          }
        }
      );
  }

  loadData(event) {
    this.page++;
    this.getProducts(event);
  }

  async getAvailableMerchantIds() {
    return new Promise((resolve, reject) => {
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
              console.log("browse page get areas subscription");
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
                this.outofRange = true;
                this.availableMerchantIds = [];
                resolve([]);
              }
            });
        })
        .catch((e) => {
          this.outofRange = true;
          reject(e);
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
  getProductSlug(product: ProductInterface) {
    if (product.nameEN) {
      return slugify(product.nameEN, {
        lower: true
      });
    } else {
      return "";
    }
  }
  getPictureUrl(product: ProductInterface) {
    return getPictureUrl(product);
  }
  isDepleted(product: ProductInterface): boolean {
    if (
      !product ||
      !product.stock ||
      !product.stock.enabled ||
      product.stock.allowNegative
    ) {
      return false;
    }
    return product.stock.quantity < 1;
  }
}

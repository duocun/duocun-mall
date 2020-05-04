import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LocationInterface } from "src/app/models/location.model";
import { LocationService } from "src/app/services/location/location.service";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { ApiService } from "src/app/services/api/api.service";
import { CategoryInterface } from "src/app/models/category.model";
import { ProductInterface } from "src/app/models/product.model";
import { getPictureUrl } from "src/app/models/product.model";
@Component({
  selector: "app-browse",
  templateUrl: "./browse.page.html",
  styleUrls: ["./browse.page.scss"]
})
export class BrowsePage implements OnInit {
  location: LocationInterface;
  viewMode: "segment" | "category-only";
  viewSegment: string;
  categories: Array<CategoryInterface>;
  selectedCategoryId: string;
  availableMerchantIds: Array<string>;
  products: Array<ProductInterface>;
  loading: boolean;
  search: string;
  page: number;
  size = 20;
  scrollDisabled: boolean;
  constructor(
    private loc: LocationService,
    private alert: AlertController,
    private translator: TranslateService,
    private router: Router,
    private api: ApiService
  ) {
    this.page = 1;
    this.viewSegment = "merchant";
    this.viewMode = "category-only";
    this.categories = [];
    this.selectedCategoryId = "";
    this.availableMerchantIds = null;
    this.loading = true;
    this.scrollDisabled = false;
    this.products = [];
  }
  ngOnInit() {
    this.loc.getLocation().subscribe((location: LocationInterface) => {
      this.location = location;
      this.getAvailableMerchantIds().then(() => {
        this.api.get("Categories/G").then((observable) => {
          observable.subscribe((resp: { code: string; data: Array<any> }) => {
            if (resp.code === "success") {
              this.categories = resp.data;
              if (this.availableMerchantIds) {
                this.getProducts(null);
              } else {
                this.loading = false;
              }
            }
          });
        });
      });
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

  handleSearch(event) {
    const search = event.detail.value;
    this.search = "";
    event.target.value = "";
    if (event.detail.value) {
      this.router.navigate(["/tabs/browse/search"], {
        queryParams: { q: search }
      });
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
        `Products/paginate/${this.page}/${this.size}`,
        query,
        true,
        "filter"
      )
      .then(
        (resp: { code: string; data: Array<ProductInterface>; meta: any }) => {
          this.products = [...this.products, ...resp.data];
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
          observable.subscribe((resp: { code: string; data: any }) => {
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
              this.availableMerchantIds = [];
              resolve([]);
            }
          });
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
  onProductClick(product: ProductInterface) {
    this.router.navigate(["/tabs/browse/products", product._id]);
  }
  getPictureUrl(product: ProductInterface) {
    return getPictureUrl(product);
  }
}

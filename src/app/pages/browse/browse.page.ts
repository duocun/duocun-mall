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
  constructor(
    private loc: LocationService,
    private alert: AlertController,
    private translator: TranslateService,
    private router: Router,
    private api: ApiService
  ) {
    this.viewSegment = "merchant";
    this.viewMode = "category-only";
    this.categories = [];
    this.selectedCategoryId = "";
    this.availableMerchantIds = [];
    this.loading = true;
  }

  ngOnInit() {
    this.loc.getLocation().subscribe((location: LocationInterface) => {
      if (location === null) {
        this.showAlert();
        this.router.navigate(["/tabs/my-account/setting"]);
      }
    });
    this.getAvailableMerchantIds().then(() => {
      this.api.get("Categories/G").then((observable) => {
        observable.subscribe((resp: { code: string; data: Array<any> }) => {
          if (resp.code === "success") {
            this.categories = resp.data;
            if (this.categories.length) {
              this.selectedCategoryId = this.categories[0]._id;
              this.getProducts();
            }
          }
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
    if (event.detail.value) {
      this.router.navigate(["/tabs/browse/search"], {
        queryParams: { q: event.detail.value }
      });
    }
  }

  handleSelectCategory(category: CategoryInterface) {
    this.loading = true;
    this.selectedCategoryId = category._id;
    this.getProducts();
  }

  getProducts() {
    this.api
      .geth(
        "Products",
        {
          categoryId: this.selectedCategoryId,
          merchantId: { $in: this.availableMerchantIds }
        },
        true,
        "filter"
      )
      .then((resp: Array<ProductInterface>) => {
        this.products = resp;
        this.loading = false;
      });
  }

  async getAvailableMerchantIds() {
    return new Promise((resolve, reject) => {
      this.loc.getLocation().subscribe((location) => {
        this.location = location;
        if (!this.location) return;
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
  onProductClick(product: ProductInterface) {
    this.router.navigate(["/tabs/browse/products", product._id]);
  }
  getPictureUrl(product: ProductInterface) {
    return getPictureUrl(product);
  }
}

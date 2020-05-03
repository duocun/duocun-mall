import { Component, OnInit } from "@angular/core";
import { CategoryInterface } from "src/app/models/category.model";
import { ProductInterface } from "src/app/models/product.model";
import { ApiService } from "src/app/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LocationService } from "src/app/services/location/location.service";
import { LocationInterface } from "src/app/models/location.model";
@Component({
  selector: "app-category",
  templateUrl: "./category.page.html",
  styleUrls: ["./category.page.scss"]
})
export class CategoryPage implements OnInit {
  loading: boolean;
  category: CategoryInterface;
  products: Array<ProductInterface>;
  availableMerchantIds: Array<string>;
  location: LocationInterface;
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private locSvc: LocationService
  ) {
    this.loading = true;
  }

  ngOnInit() {
    this.route.params.subscribe((params: { id: string }) => {
      const categoryId = params.id;
      this.getAvailableMerchantIds().then(() => {
        this.api.get(`Categories/G/${categoryId}`).then((observable) => {
          observable.subscribe(
            (resp: { code: string; data: CategoryInterface }) => {
              if (resp.code === "success") {
                this.category = resp.data;
                this.getProducts();
              }
            }
          );
        });
      });
    });
  }
  async getAvailableMerchantIds() {
    return new Promise((resolve, reject) => {
      this.locSvc.getLocation().subscribe((location) => {
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
    this.router.navigate(["/tabs/browse/products", product._id]);
  }
}

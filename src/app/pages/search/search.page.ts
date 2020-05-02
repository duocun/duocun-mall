import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductInterface } from "src/app/models/product.model";
import { ApiService } from "src/app/services/api/api.service";
import { LocationService } from "src/app/services/location/location.service";
import { LocationInterface } from "src/app/models/location.model";

@Component({
  selector: "app-search",
  templateUrl: "./search.page.html",
  styleUrls: ["./search.page.scss"]
})
export class SearchPage implements OnInit {
  search: string;
  loading: boolean;
  products: Array<ProductInterface>;
  availableMerchantIds: Array<string>;
  location: LocationInterface;
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private locSvc: LocationService
  ) {
    this.search = "";
    this.loading = true;
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.search = params.q || "";
      this.getAvailableMerchantIds().then(() => {
        this.getProducts();
      });
    });
  }
  handleSearch(event) {
    this.search = event.detail.value;
    if (this.search) {
      this.getProducts();
    }
  }
  async getAvailableMerchantIds() {
    return new Promise((resolve, reject) => {
      this.locSvc.getLocation().subscribe((location) => {
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
  getProducts() {
    this.api
      .geth(
        "Products",
        {
          name: { $regex: this.search },
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
  onProductClick(product: ProductInterface) {
    this.router.navigate(["/tabs/browse/products", product._id]);
  }
}

import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api/api.service";
import { MerchantInterface } from "src/app/models/merchant.model";
import { ProductInterface, getPictureUrl } from "src/app/models/product.model";
import { ActivatedRoute } from "@angular/router";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-merchant",
  templateUrl: "./merchant.page.html",
  styleUrls: ["./merchant.page.scss"]
})
export class MerchantPage implements OnInit {
  loading: boolean;
  merchant: MerchantInterface;
  products: Array<ProductInterface>;

  constructor(private api: ApiService, private route: ActivatedRoute) {
    this.loading = true;
  }

  ngOnInit() {
    this.updateData();
  }

  updateData() {
    this.route.params.subscribe((params: { id: string }) => {
      const merchantId = params.id;
      this.api.get(`Merchants/G/${merchantId}`).then((observable) => {
        observable.subscribe(
          (resp: { code: string; data: MerchantInterface }) => {
            this.merchant = resp.data;
            this.api.get(`Products/G`, { merchantId }).then((observable) => {
              observable.subscribe(
                (resp: { code: string; data: Array<ProductInterface> }) => {
                  this.products = resp.data;
                  this.loading = false;
                }
              );
            });
          }
        );
      });
    });
  }

  getPictureUrl(product: ProductInterface) {
    return getPictureUrl(product);
  }
}

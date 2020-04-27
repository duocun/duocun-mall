import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "src/app/services/api/api.service";
import { ProductInterface, getPictureUrl } from "src/app/models/product.model";

@Component({
  selector: "app-product",
  templateUrl: "./product.page.html",
  styleUrls: ["./product.page.scss"]
})
export class ProductPage implements OnInit {
  loading: boolean;
  product: ProductInterface;

  constructor(private route: ActivatedRoute, private api: ApiService) {
    this.loading = true;
  }

  ngOnInit() {
    this.updateData();
  }

  updateData() {
    this.route.params.subscribe((params: { id: string }) => {
      const productId = params.id;
      this.api.get(`products/${productId}`).then((observable) => {
        observable.subscribe((data: ProductInterface) => {
          this.product = data;
          this.loading = false;
        });
      });
    });
  }

  getPictureUrl(product: ProductInterface, idx: number) {
    return getPictureUrl(product, idx);
  }
}

import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "src/app/services/api/api.service";
import { ProductInterface, getPictureUrl } from "src/app/models/product.model";
import { CartItemInterface } from "src/app/models/cart.model";
import { MerchantInterface } from "src/app/models/merchant.model";
import { CartService } from "src/app/services/cart/cart.service";

@Component({
  selector: "app-product",
  templateUrl: "./product.page.html",
  styleUrls: ["./product.page.scss"]
})
export class ProductPage implements OnInit {
  loading: boolean;
  merchant: MerchantInterface;
  product: ProductInterface;
  item: CartItemInterface;
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private cart: CartService
  ) {
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
          if (data) {
            this.product = data;
            this.api
              .geth("Restaurants/qFind", { _id: data.merchantId })
              .then((merchants: Array<MerchantInterface>) => {
                this.merchant = merchants[0];
                if (this.merchant) {
                  this.item = {
                    productId: this.product._id,
                    productName: this.product.name,
                    merchantId: this.merchant._id,
                    merchantName: this.merchant.name,
                    price: this.product.price,
                    cost: this.product.cost,
                    quantity: 1
                  };
                  this.loading = false;
                }
              });
          } else {
            this.loading = false;
          }
        });
      });
    });
  }

  handleQuantityChange(event: {
    value: number;
    action: "up" | "down" | "set";
  }) {
    this.item.quantity = event.value;
  }

  getPictureUrl(product: ProductInterface, idx: number) {
    return getPictureUrl(product, idx);
  }

  addToCart() {
    this.cart.addItem(this.item);
  }
}

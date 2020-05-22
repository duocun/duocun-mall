import { Component, OnInit, Input, Output } from "@angular/core";
import { ProductInterface, getPictureUrl } from "src/app/models/product.model";
import { EventEmitter } from "@angular/core";

@Component({
  selector: "product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"]
})
export class ProductListComponent implements OnInit {
  @Input("products") products: Array<ProductInterface>;
  @Input("loading") loading: boolean;
  @Output("onProductClick") onProductClick = new EventEmitter<
    ProductInterface
  >();
  constructor() {
    this.loading = this.loading || true;
    this.products = this.products || [];
  }

  ngOnInit() {}

  getPictureUrl(product: ProductInterface) {
    return getPictureUrl(product);
  }

  handleClick(product: ProductInterface) {
    this.onProductClick.emit(product);
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

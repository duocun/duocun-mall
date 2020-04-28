import { Component, OnInit } from "@angular/core";
import { CartService } from "src/app/services/cart/cart.service";
import * as Order from "src/app/models/order.model";
import { getPictureUrl, ProductInterface } from "src/app/models/product.model";
@Component({
  selector: "app-order",
  templateUrl: "./order.page.html",
  styleUrls: ["./order.page.scss"]
})
export class OrderPage implements OnInit {
  chargeItems;
  order: Order.OrderInterface;
  orderGroups: Array<any>;
  summary: Order.OrderSummaryInterface;
  constructor(private cartSvc: CartService) {}

  ngOnInit() {
    this.cartSvc.getCart().subscribe((cart) => {
      this.chargeItems = Order.getChargeItems(cart);
      this.orderGroups = Order.getOrderGroups(cart);
      this.summary = Order.getOrderSummary(this.orderGroups, 0);
    });
  }

  getPictureUrl(item: ProductInterface) {
    return getPictureUrl(item);
  }
}

import { Component, OnInit } from "@angular/core";
import { CartService } from "src/app/services/cart/cart.service";
import { CartInterface, CartItemInterface } from "src/app/models/cart.model";
import { ProductInterface, getPictureUrl } from "src/app/models/product.model";
import { getCartItemSubtotal } from "src/app/models/cart.model";
@Component({
  selector: "app-cart",
  templateUrl: "./cart.page.html",
  styleUrls: ["./cart.page.scss"]
})
export class CartPage implements OnInit {
  cart: CartInterface;
  constructor(private cartSvc: CartService) {}

  ngOnInit() {
    this.cartSvc.getCart().subscribe((cart: CartInterface) => {
      this.cart = cart;
    });
  }

  handleClearCart() {
    this.cartSvc.clearCart();
  }

  cartItemSubtotal(item: CartItemInterface) {
    return getCartItemSubtotal(item);
  }

  handleCartItemQuantityChange(itemIdx: number, quantity: number) {
    this.cartSvc.setItemQuantity(itemIdx, quantity);
  }

  getPictureUrl(product: ProductInterface) {
    return getPictureUrl(product);
  }
}

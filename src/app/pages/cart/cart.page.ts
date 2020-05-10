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
  cartSanizited: boolean;
  constructor(private cartSvc: CartService) {
    this.cartSanizited = false;
  }

  ngOnInit() {
    this.cartSvc.getCart().subscribe((cart: CartInterface) => {
      this.cart = cart;
      if (this.cart && this.cart.items && !this.cartSanizited) {
        this.cartSanizited = true;
        this.cartSvc.sanitize();
      }
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

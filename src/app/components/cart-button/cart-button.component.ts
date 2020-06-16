import { Component, OnInit, OnDestroy } from "@angular/core";
import { CartService } from "src/app/services/cart/cart.service";
import { Subject } from "rxjs";
import { CartInterface } from "src/app/models/cart.model";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "cart-button",
  templateUrl: "./cart-button.component.html",
  styleUrls: ["./cart-button.component.scss"]
})
export class CartButtonComponent implements OnInit, OnDestroy {
  cart: CartInterface;
  private unsubscribe$ = new Subject<void>();
  constructor(private cartSvc: CartService) {}

  ngOnInit() {
    this.cartSvc
      .getCart()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((cart: CartInterface) => {
        console.log("home page cart subscription");
        this.cart = cart;
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

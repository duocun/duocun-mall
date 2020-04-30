import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Platform } from "@ionic/angular";
import {
  CartInterface,
  CartItemInterface,
  areEqualCartItems,
  getCartQuantity
} from "src/app/models/cart.model";
import { environment } from "src/environments/environment";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CartService {
  private cart: CartInterface;
  private cart$: BehaviorSubject<CartInterface>;

  constructor(private storage: Storage, private platform: Platform) {
    this.cart = { items: [] };
    this.cart$ = new BehaviorSubject<CartInterface>(this.cart);
    this.platform.ready().then(() => {
      this.initCart();
    });
  }

  initCart() {
    this.storage.get(environment.storageKey.cart).then((cartData: any) => {
      if (cartData) {
        this.cart = cartData;
        this.cart$.next(this.cart);
      }
    });
  }

  saveCart() {
    this.cart.quantity = getCartQuantity(this.cart);
    this.cart$.next(this.cart);
    return this.storage.set(environment.storageKey.cart, this.cart);
  }

  getCart(): BehaviorSubject<CartInterface> {
    return this.cart$;
  }

  setItemQuantity(itemIndex: number, quantity: number): CartInterface {
    if (quantity < 1) {
      this.cart.items.splice(itemIndex, 1);
    } else {
      this.cart.items[itemIndex].quantity = quantity;
    }
    this.saveCart();
    return this.cart;
  }

  upItemQuantity(itemIndex: number): CartInterface {
    this.cart.items[itemIndex].quantity += 1;
    this.saveCart();
    return this.cart;
  }

  downItemQuantity(itemIndex: number): CartInterface {
    if (this.cart.items[itemIndex].quantity > 1) {
      this.cart.items[itemIndex].quantity -= 1;
      this.saveCart();
    } else {
      return this.setItemQuantity(itemIndex, 0);
    }
  }

  addItem(item: CartItemInterface) {
    const existingItemIdx = this.cart.items.findIndex((existing) =>
      areEqualCartItems(existing, item)
    );
    if (existingItemIdx !== -1) {
      this.setItemQuantity(
        existingItemIdx,
        this.cart.items[existingItemIdx].quantity + item.quantity
      );
    } else {
      this.cart.items.push(item);
      this.saveCart();
    }
  }

  getItemQuantity(item: CartItemInterface) {
    const existingItemIdx = this.cart.items.findIndex((existing) =>
      areEqualCartItems(existing, item)
    );
    if (existingItemIdx !== -1) {
      return this.cart.items[existingItemIdx].quantity;
    }
    return 0;
  }

  setItem(item: CartItemInterface) {
    const existingItemIdx = this.cart.items.findIndex((existing) =>
      areEqualCartItems(existing, item)
    );
    if (existingItemIdx !== -1) {
      if (item.quantity < 1) {
        this.setItemQuantity(existingItemIdx, 0);
      } else {
        this.cart.items[existingItemIdx] = item;
        this.saveCart();
      }
    } else {
      this.cart.items.push(item);
      this.saveCart();
    }
  }

  clearCart() {
    this.cart = { items: [] };
    this.saveCart();
  }
}

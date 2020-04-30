import { DeliveryDateTimeInterface } from "./delivery.model";
import { areEqualDeliveryDateTime } from "./delivery.model";
import { ProductInterface } from "./product.model";

export interface CartItemInterface {
  product?: ProductInterface;
  productId: string;
  productName: string; // product name
  merchantId: string;
  merchantName: string;
  price: number;
  cost: number;
  quantity: number;
  delivery?: DeliveryDateTimeInterface;
}

export interface CartInterface {
  clientId?: string;
  clientName?: string;
  clientPhoneNumber?: string;
  merchantId?: string;
  merchantName?: string;
  price?: number;
  quantity?: number;
  items?: CartItemInterface[];
}

export function areEqualCartItems(
  one: CartItemInterface,
  other: CartItemInterface
) {
  if (one.productId !== other.productId) {
    return false;
  }
  if (!one.delivery && !other.delivery) {
    return one.productId === other.productId;
  }
  if ((!one.delivery && other.delivery) || (one.delivery && !other.delivery)) {
    return false;
  }
  return areEqualDeliveryDateTime(one.delivery, other.delivery);
}

export function getCartQuantity(cart: CartInterface) {
  let quantity = 0;
  if (cart.items) {
    cart.items.forEach((item) => (quantity += item.quantity));
  }
  return quantity;
}

export function getCartItemSubtotal(item: CartItemInterface) {
  return item.price * item.quantity;
}

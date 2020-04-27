export interface CartItemInterface {
  productId: string;
  productName: string; // product name
  merchantId: string;
  merchantName: string;
  price: number;
  cost: number;
  quantity: number;
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
  return one.productId === other.productId;
}

export function getCartQuantity(cart: CartInterface) {
  let quantity = 0;
  if (cart.items) {
    cart.items.forEach((item) => (quantity += item.quantity));
  }
  return quantity;
}

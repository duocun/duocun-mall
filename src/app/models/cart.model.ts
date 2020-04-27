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
  merchantId: string;
  merchantName?: string;
  price?: number;
  quantity?: number;
  items: CartItemInterface[];
}

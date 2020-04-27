import { MerchantInterface } from "./merchant.model";

export enum ProductStatus {
  ACTIVE = 1,
  INACTIVE,
  NEW,
  PROMOTE
}

export interface ProductInterface {
  _id?: string;
  name: string;
  nameEN: string;
  description?: string;
  price: number;
  cost?: number;
  merchantId: string;
  categoryId: string;

  openDays?: number[];
  restaurant?: MerchantInterface; // ??
  category?: any;
  pictures?: any[];
  dow?: string[];
  order?: number;
  status?: ProductStatus;
  created?: string;
  modified?: string;

  merchant?: MerchantInterface; // join account table from find()
  merchantAccount?: any; // join account table from find()
}

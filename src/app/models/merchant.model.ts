import { GeoPointInterface } from "./location.model";
import { ProductInterface } from "./product.model";

export const MerchantType = {
  RESTAURANT: "R",
  GROCERY: "G",
  FRESH: "F",
  TELECOM: "T"
};

export const MerchantStatus = {
  ACTIVE: "A",
  INACTIVE: "I"
};

export interface PhaseInterface {
  orderEnd: string; // hh:mm
  pickup: string; // hh:mm
}

export interface MerchantInterface {
  _id?: string;
  name: string;
  nameEN: string;
  description?: string;
  location?: GeoPointInterface;
  accountId: string;
  malls?: string[]; // mall id
  inRange?: boolean;
  type: string;
  created?: string;
  modified?: string;

  dow?: string; // day of week opening, eg. '1,2,3,4,5'
  isClosed?: boolean;
  distance?: number; // km
  deliveryCost?: number;

  pictureId?: string;

  order?: number;
  products?: ProductInterface[];
  orders?: any[];
  pictures?: any[];
  address?: any;
  onSchedule?: boolean;

  phases: PhaseInterface[];
  orderEnded: boolean; // do not save to db
  orderEndTime: string; // do not save to db
}

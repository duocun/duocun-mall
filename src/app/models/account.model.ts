import { LocationInterface } from "./location.model";

export interface AccountInterface {
  _id: string;
  username?: string;
  imageurl?: string;
  sex?: number;
  type?: string;
  realm?: string;
  openId?: string;
  balance?: number;
  attributes?: Array<any>;
  created?: string;
  modified?: string;
  phone: string;
  secondPhone?: string;
  location?: LocationInterface;
  verified?: boolean;
  pickup?: any;
  verificationCode?: string;
}

export interface RegisterAccountInterface {
  phone: string;
  username: string;
  verificationCode?: string;
}

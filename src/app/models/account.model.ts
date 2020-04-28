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
  verified?: boolean;
  pickup?: any;
}

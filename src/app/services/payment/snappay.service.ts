import { Injectable } from "@angular/core";

import { ApiService } from "../api/api.service";

@Injectable({
  providedIn: "root"
})
export class SnappayService {
  constructor(private api: ApiService) {}

  // return observable
  pay(
    method: string,
    paymentMethod: string,
    orders: Array<any>, // Array<Order.OrderInterface>,
    amount: number,
    description: string,
    returnUrl: string // `${window.location.origin}/tabs/my-account/transaction-history?state=${appCode}`;
  ) {
    const paymentId = orders ? orders[0].paymentId : null;
    return this.api.post("payments/snappay/pay", {
      // paymentActionCode: "P",
      method,
      paymentMethod,
      amount,
      description,
      returnUrl,
      paymentId,
      merchantNames: orders.map((order) => order.merchantName)
    });
  }
}

import { Injectable } from "@angular/core";

import { ApiService } from "../api/api.service";

@Injectable({
  providedIn: "root"
})
export class AlphapayService {
  constructor(private api: ApiService) {}

  // return observable
  pay(paymentId: string, channelType: string, gateway: string) {
    return this.api.postV2("payments/alphapay/pay", {
      // paymentActionCode: "P",
      paymentId,
      channelType,
      gateway
    });
  }
}

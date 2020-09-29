import { Injectable } from "@angular/core";

import { ApiService } from "../api/api.service";

@Injectable({
  providedIn: "root"
})
export class MonerisService {
  constructor(private api: ApiService) {}

  // return observable
  pay(paymentId: string, cc: string, exp: string, cvd: string) {
    return this.api.postV2("payments/moneris/pay", {
      paymentId,
      cc,
      exp,
      cvd
    });
  }
}

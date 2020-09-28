import { Injectable } from "@angular/core";
import { SnappayService } from "./snappay.service";
import { MonerisService } from "./moneris.service";
import { AlphapayService } from "./alphapay.service";

export const ResponseStatus = {
  SUCCESS: "S",
  FAIL: "F"
};

@Injectable({
  providedIn: "root"
})
export class PaymentService {
  constructor(
    private snappaySvc: SnappayService,
    private monerisSvc: MonerisService,
    private alphaSvc: AlphapayService
  ) {}

  payBySnappay(
    // appCode: string,
    // accountId: string,
    method: string,
    paymentMethod: string,
    orders: Array<any>, // Array<Order.OrderInterface>,
    amount: number,
    description: string,
    returnUrl: string,
    browserType: string
  ) {
    return this.snappaySvc.pay(
      // appCode,
      method,
      paymentMethod,
      orders,
      amount,
      description,
      returnUrl,
      browserType
    );

    //   const returnUrl = `${window.location.origin}/tabs/my-account/transaction-history?state=${appCode}`;
    //   const paymentId = orders ? orders[0].paymentId : null;
    //   return this.api
    //     .post("payments/snappay/pay", {
    //       // paymentActionCode: "P",
    //       // appCode,
    //       // accountId,
    //       method,
    //       paymentMethod,
    //       amount,
    //       returnUrl,
    //       // note: "",
    //       paymentId,
    //       merchantNames: orders.map((order) => order.merchantName)
    //     });
  }

  payByAlphapay(paymentId: string, channelType: string, gateway: string) {
    return this.alphaSvc.pay(
      // paymentActionCode: "P",
      paymentId,
      channelType,
      gateway
    );
  }

  payByCreditCard(paymentId: string, cc: string, exp: string, cvd: string) {
    return this.monerisSvc.pay(paymentId, cc, exp, cvd);
  }
}

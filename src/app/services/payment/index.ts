import { Injectable } from '@angular/core';
import { SnappayService } from './snappay.service';

@Injectable({
    providedIn: "root"
})
export class PaymentService{
    constructor(
        private snappaySvc: SnappayService
    ) {

    }
  
    pay(
      vendor: string,
      // appCode: string,
      // accountId: string,
      method: string,
      paymentMethod: string,
      orders: Array<any>, // Array<Order.OrderInterface>,
      amount: number,
      description: string,
      returnUrl: string,
    ) {
        if(vendor === 'snappay'){
            return this.snappaySvc.pay(
                // appCode,
                method,
                paymentMethod,
                orders,
                amount,
                description,
                returnUrl,
            );
        }else if(vendor === 'alphapay'){

        }else if(vendor === 'moneris'){

        }else if(vendor === 'strip'){

        }else{

        }
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
  }
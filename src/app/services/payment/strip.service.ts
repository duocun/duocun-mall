//   stripePay(token: StripeToken) {
//     throw new Error("Stripe payment is disabled. Use Moneris instead");
//     this.paymentMethod = PaymentMethod.CREDIT_CARD;
//     this.processing = true;
//     this.presentLoading();
//     this.stripe
//       .createPaymentMethod({
//         type: "card",
//         card: {
//           token: token.id
//         },
//         // eslint-disable-next-line @typescript-eslint/camelcase
//         billing_details: { name: this.account.username }
//       })
//       .then((res) => {
//         if (res.error) {
//           this.showAlert("Notice", "Payment failed", "OK");
//           return;
//         }
//         const paymentMethodId = res.paymentMethod.id;
//         this.saveOrders(this.orders)
//           .then((observable) => {
//             observable
//               .pipe(takeUntil(this.unsubscribe$))
//               .subscribe(
//                 (resp: { code: string; data: Array<Order.OrderInterface> }) => {
//                   console.log("order page save order subscription");
//                   if (resp.code !== "success") {
//                     return this.handleInvalidOrders(resp.data);
//                   }
//                   const newOrders = resp.data;
//                   this.savePayment(newOrders, paymentMethodId)
//                     .then((observable) => {
//                       observable
//                         .pipe(takeUntil(this.unsubscribe$))
//                         .subscribe(async (resp: any) => {
//                           console.log("order page save payment subscription");
//                           if (resp.err === PaymentError.NONE) {
//                             this.showAlert("Notice", "Payment success", "OK");
//                             this.cartSubscription.unsubscribe();
//                             this.cartSvc.clearCart();
//                             await this.authSvc.updateData();
//                             this.processing = false;
//                             await this.dismissLoading();
//                             console.log("navigate to order history");
//                             this.router.navigate(
//                               ["/tabs/my-account/order-history"],
//                               {
//                                 replaceUrl: true
//                               }
//                             );
//                           } else {
//                             if (resp.data) {
//                               this.handleInvalidOrders(resp.data);
//                             } else {
//                               this.showAlert("Notice", "Payment failed", "OK");
//                               this.processing = false;
//                               this.dismissLoading();
//                             }
//                           }
//                         });
//                     })
//                     .catch((e) => {
//                       console.error(e);
//                       this.error = {
//                         type: "payment",
//                         message: "Cannot save payment"
//                       };
//                       this.processing = false;
//                       this.dismissLoading();
//                     });
//                 }
//               );
//           })
//           .catch((e) => {
//             console.error(e);
//             this.error = {
//               type: "order",
//               message: "Cannot save orders"
//             };
//             this.processing = false;
//             this.dismissLoading();
//           });
//       })
//       .catch((e) => {
//         console.error(e);
//         this.processing = false;
//         this.dismissLoading();
//       });
//   }

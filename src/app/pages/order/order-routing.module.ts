import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { OrderPage } from "./order.page";
import { AuthGuard } from "src/app/guards/auth/auth.guard";
import { MonerisCheckoutComponent } from "src/app/pages/order/moneris-checkout/moneris-checkout.component";

const routes: Routes = [
  {
    path: "pay/moneris/:paymentId/:ticket",
    component: MonerisCheckoutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "",
    component: OrderPage,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderPageRoutingModule {}

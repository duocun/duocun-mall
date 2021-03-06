import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AccountSettingPage } from "./account-setting.page";
import { DeliveryRangePage } from "../delivery-range/delivery-range.page";

const routes: Routes = [
  {
    path: "",
    component: AccountSettingPage
  },
  {
    path: "delivery-range",
    component: DeliveryRangePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountSettingPageRoutingModule {}

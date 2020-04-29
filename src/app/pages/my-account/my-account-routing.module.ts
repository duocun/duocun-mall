import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { MyAccountPage } from "./my-account.page";

const routes: Routes = [
  {
    path: "",
    component: MyAccountPage
  },
  {
    path: "order-history",
    loadChildren: () =>
      import("../order-history/order-history.module").then(
        (m) => m.OrderHistoryPageModule
      )
  },
  {
    path: "transaction-history",
    loadChildren: () =>
      import("../transaction-history/transaction-history.module").then(
        (m) => m.TransactionHistoryPageModule
      )
  },
  {
    path: "setting",
    loadChildren: () =>
      import("../account-setting/account-setting.module").then(
        (m) => m.AccountSettingPageModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAccountPageRoutingModule {}

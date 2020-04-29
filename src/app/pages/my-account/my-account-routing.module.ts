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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAccountPageRoutingModule {}

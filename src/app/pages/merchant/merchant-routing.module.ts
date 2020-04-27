import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { MerchantPage } from "./merchant.page";

const routes: Routes = [
  {
    path: ":id",
    component: MerchantPage
  },
  {
    path: "",
    redirectTo: "/tabs/browse",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantPageRoutingModule {}

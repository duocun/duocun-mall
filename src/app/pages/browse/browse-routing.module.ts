import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { BrowsePage } from "./browse.page";

const routes: Routes = [
  {
    path: "",
    component: BrowsePage
  },
  {
    path: "merchants",
    loadChildren: () =>
      import("../merchant/merchant.module").then((m) => m.MerchantPageModule)
  },
  {
    path: "products",
    loadChildren: () =>
      import("../product/product.module").then((m) => m.ProductPageModule)
  },
  {
    path: "order",
    loadChildren: () =>
      import("../order/order.module").then((m) => m.OrderPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrowsePageRoutingModule {}

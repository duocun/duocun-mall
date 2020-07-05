import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ProductPage } from "./product.page";

const routes: Routes = [
  {
    path: ":slug/:id",
    component: ProductPage
  },
  {
    path: ":id",
    component: ProductPage
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
export class ProductPageRoutingModule {}

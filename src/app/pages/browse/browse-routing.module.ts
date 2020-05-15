import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { BrowsePage } from "./browse.page";
import { AuthGuard } from "src/app/guards/auth/auth.guard";
import { LocationGuard } from "src/app/guards/location/location.guard";

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
    canActivate: [AuthGuard, LocationGuard],
    loadChildren: () =>
      import("../product/product.module").then((m) => m.ProductPageModule)
  },
  {
    path: "order",
    canActivate: [AuthGuard, LocationGuard],
    loadChildren: () =>
      import("../order/order.module").then((m) => m.OrderPageModule)
  },
  {
    path: "all-categories",
    loadChildren: () =>
      import("./categories/categories.module").then(
        (m) => m.CategoriesPageModule
      )
  },
  {
    path: "categories",
    loadChildren: () =>
      import("../category/category.module").then((m) => m.CategoryPageModule)
  },
  {
    path: "search",
    loadChildren: () =>
      import("../search/search.module").then((m) => m.SearchPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrowsePageRoutingModule {}

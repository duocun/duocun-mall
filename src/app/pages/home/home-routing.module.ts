import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomePage } from "./home.page";

const routes: Routes = [
  {
    path: "tabs",
    component: HomePage,
    children: [
      {
        path: "browse",
        loadChildren: () =>
          import("../browse/browse.module").then((m) => m.BrowsePageModule)
      },
      {
        path: "cart",
        loadChildren: () =>
          import("../cart/cart.module").then((m) => m.CartPageModule)
      },
      {
        path: "my-account",
        loadChildren: () =>
          import("../my-account/my-account.module").then(
            (m) => m.MyAccountPageModule
          )
      },
      {
        path: "",
        redirectTo: "/tabs/browse",
        pathMatch: "full"
      }
    ]
  },
  {
    path: "merchants",
    component: HomePage,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("../merchant/merchant.module").then(
            (m) => m.MerchantPageModule
          )
      }
    ]
  },
  {
    path: "products",
    component: HomePage,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("../product/product.module").then((m) => m.ProductPageModule)
      }
    ]
  },
  {
    path: "order",
    component: HomePage,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("../order/order.module").then((m) => m.OrderPageModule)
      }
    ]
  },
  {
    path: "",
    redirectTo: "/tabs/browse"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}

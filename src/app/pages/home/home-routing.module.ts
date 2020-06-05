import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomePage } from "./home.page";
import { StaticPageModule } from "src/app/pages/static-page/static-page.module";
import { AuthGuard } from "src/app/guards/auth/auth.guard";
import { LocationGuard } from "src/app/guards/location/location.guard";

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
        canActivate: [LocationGuard],
        loadChildren: () =>
          import("../cart/cart.module").then((m) => m.CartPageModule)
      },
      {
        path: "my-account",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("../my-account/my-account.module").then(
            (m) => m.MyAccountPageModule
          )
      },
      {
        path: "order-history",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("../order-history/order-history.module").then(
            (m) => m.OrderHistoryPageModule
          )
      },
      {
        path: "login",
        loadChildren: () =>
          import("../login/login.module").then((m) => m.LoginPageModule)
      },
      {
        path: "register",
        loadChildren: () =>
          import("../register/register.module").then(
            (m) => m.RegisterPageModule
          )
      }
    ]
  },
  {
    path: "page",
    loadChildren: () =>
      import("../static-page/static-page.module").then(
        (m) => m.StaticPageModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), StaticPageModule],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}

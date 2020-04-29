import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomePage } from "./home.page";
import { AuthGuard } from "src/app/guards/auth.guard";

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
        canActivate: [AuthGuard],
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
    path: "",
    redirectTo: "/tabs/browse"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { StaticPage } from "./static-page.page";

const routes: Routes = [
  {
    path: "browse",
    redirectTo: "/tabs/browse"
  },
  {
    path: "cart",
    redirectTo: "/tabs/cart"
  },
  {
    path: "my-account",
    redirectTo: "/tabs/my-account"
  },
  {
    path: ":slug",
    component: StaticPage
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
export class StaticPageRoutingModule {}

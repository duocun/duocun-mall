import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./pages/home/home.module").then((m) => m.HomePageModule)
  },
  {
    path: "order-history",
    loadChildren: () =>
      import("./pages/order-history/order-history.module").then(
        (m) => m.OrderHistoryPageModule
      )
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

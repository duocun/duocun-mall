import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { TransactionHistoryPage } from "./transaction-history.page";
import { DetailComponent } from "./detail/detail.component";

const routes: Routes = [
  {
    path: "",
    component: TransactionHistoryPage
  },
  {
    path: "detail/:scope/:code",
    component: DetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionHistoryPageRoutingModule {}

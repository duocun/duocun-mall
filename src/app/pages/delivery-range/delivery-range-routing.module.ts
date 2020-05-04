import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DeliveryRangePage } from "./delivery-range.page";

const routes: Routes = [
  {
    path: "",
    component: DeliveryRangePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryRangePageRoutingModule {}

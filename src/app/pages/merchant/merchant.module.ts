import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { MerchantPageRoutingModule } from "./merchant-routing.module";

import { MerchantPage } from "./merchant.page";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";
import { IonImageModule } from "src/app/components/ion-image/ion-image.module";
import { PricePipeModule } from "src/app/pipes/price/price.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MerchantPageRoutingModule,
    LocalValueDirectiveModule,
    IonImageModule,
    PricePipeModule
  ],
  declarations: [MerchantPage]
})
export class MerchantPageModule {}

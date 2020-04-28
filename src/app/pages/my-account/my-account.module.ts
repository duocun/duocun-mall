import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { MyAccountPageRoutingModule } from "./my-account-routing.module";

import { MyAccountPage } from "./my-account.page";
import { TranslateModule } from "@ngx-translate/core";
import { IonImageModule } from "src/app/components/ion-image/ion-image.module";
import { PricePipeModule } from "src/app/pipes/price/price.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyAccountPageRoutingModule,
    TranslateModule.forChild(),
    IonImageModule,
    PricePipeModule
  ],
  declarations: [MyAccountPage]
})
export class MyAccountPageModule {}

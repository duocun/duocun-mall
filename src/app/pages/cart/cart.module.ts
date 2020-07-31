import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CartPageRoutingModule } from "./cart-routing.module";

import { CartPage } from "./cart.page";
import { TranslateModule } from "@ngx-translate/core";
import { IonImageModule } from "src/app/components/ion-image/ion-image.module";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";
import { PricePipeModule } from "src/app/pipes/price/price.module";
import { MomentPipeModule } from "src/app/pipes/moment/moment.module";
import { TouchspinModule } from "src/app/components/touchspin/touchspin.module";
import { FooterModule } from "src/app/components/footer/footer.module";
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartPageRoutingModule,
    TranslateModule.forChild(),
    IonImageModule,
    LocalValueDirectiveModule,
    PricePipeModule,
    MomentPipeModule,
    TouchspinModule,
    FooterModule,
    ComponentsModule
  ],
  declarations: [CartPage]
})
export class CartPageModule {}

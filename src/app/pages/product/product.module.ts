import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ProductPageRoutingModule } from "./product-routing.module";

import { ProductPage } from "./product.page";
import { IonImageModule } from "src/app/components/ion-image/ion-image.module";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";
import { TouchspinModule } from "src/app/components/touchspin/touchspin.module";
import { PricePipeModule } from "src/app/pipes/price/price.module";
import { TranslateModule } from "@ngx-translate/core";
import { MomentPipeModule } from "src/app/pipes/moment/moment.module";
import { FooterModule } from "src/app/components/footer/footer.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductPageRoutingModule,
    IonImageModule,
    LocalValueDirectiveModule,
    TouchspinModule,
    PricePipeModule,
    TranslateModule.forChild(),
    MomentPipeModule,
    FooterModule
  ],
  declarations: [ProductPage]
})
export class ProductPageModule {}

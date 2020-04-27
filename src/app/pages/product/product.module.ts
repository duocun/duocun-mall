import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ProductPageRoutingModule } from "./product-routing.module";

import { ProductPage } from "./product.page";
import { IonImageModule } from "src/app/components/ion-image/ion-image.module";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductPageRoutingModule,
    IonImageModule,
    LocalValueDirectiveModule
  ],
  declarations: [ProductPage]
})
export class ProductPageModule {}

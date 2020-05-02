import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ProductListComponent } from "./product-list.component";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";
import { PricePipeModule } from "src/app/pipes/price/price.module";
import { IonImageModule } from "src/app/components/ion-image/ion-image.module";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    HttpClientModule,
    LocalValueDirectiveModule,
    PricePipeModule,
    IonImageModule,
    TranslateModule.forChild()
  ],
  declarations: [ProductListComponent],
  exports: [ProductListComponent]
})
export class ProductListModule {}

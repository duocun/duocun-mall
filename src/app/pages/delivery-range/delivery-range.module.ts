import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { DeliveryRangePageRoutingModule } from "./delivery-range-routing.module";

import { DeliveryRangePage } from "./delivery-range.page";
import { TranslateModule } from "@ngx-translate/core";
import { AgmCoreModule } from "@agm/core";
import { environment } from "src/environments/environment";
import { FooterModule } from "src/app/components/footer/footer.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeliveryRangePageRoutingModule,
    TranslateModule.forChild(),
    AgmCoreModule.forRoot({
      apiKey: environment.gmap
    }),
    FooterModule
  ],
  declarations: [DeliveryRangePage]
})
export class DeliveryRangePageModule {}

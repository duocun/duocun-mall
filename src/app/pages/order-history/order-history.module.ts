import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { OrderHistoryPageRoutingModule } from "./order-history-routing.module";

import { OrderHistoryPage } from "./order-history.page";
import { TranslateModule } from "@ngx-translate/core";
import { PricePipeModule } from "src/app/pipes/price/price.module";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";
import { MomentPipeModule } from "src/app/pipes/moment/moment.module";
import { FooterModule } from "src/app/components/footer/footer.module";
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderHistoryPageRoutingModule,
    TranslateModule.forChild(),
    PricePipeModule,
    LocalValueDirectiveModule,
    MomentPipeModule,
    FooterModule,
    ComponentsModule
  ],
  declarations: [OrderHistoryPage]
})
export class OrderHistoryPageModule {}

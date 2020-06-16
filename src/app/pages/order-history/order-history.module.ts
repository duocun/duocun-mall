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
import { CartButtonModule } from "src/app/components/cart-button/cart-button.module";
import { LanguageButtonModule } from "src/app/components/language-button/language-button.module";

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
    CartButtonModule,
    LanguageButtonModule
  ],
  declarations: [OrderHistoryPage]
})
export class OrderHistoryPageModule {}

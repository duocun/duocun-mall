import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { TransactionHistoryPageRoutingModule } from "./transaction-history-routing.module";

import { TransactionHistoryPage } from "./transaction-history.page";
import { TranslateModule } from "@ngx-translate/core";
import { PricePipeModule } from "src/app/pipes/price/price.module";
import { MomentPipeModule } from "src/app/pipes/moment/moment.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransactionHistoryPageRoutingModule,
    TranslateModule.forChild(),
    PricePipeModule,
    MomentPipeModule
  ],
  declarations: [TransactionHistoryPage]
})
export class TransactionHistoryPageModule {}

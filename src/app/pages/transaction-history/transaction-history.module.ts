import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { TransactionHistoryPageRoutingModule } from "./transaction-history-routing.module";

import { TransactionHistoryPage } from "./transaction-history.page";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransactionHistoryPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [TransactionHistoryPage]
})
export class TransactionHistoryPageModule {}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { PaymentSuccessPageRoutingModule } from "./payment-success-routing.module";

import { PaymentSuccessPage } from "./payment-success.page";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentSuccessPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [PaymentSuccessPage]
})
export class PaymentSuccessPageModule {}

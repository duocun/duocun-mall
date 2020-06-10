import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { OrderPageRoutingModule } from "./order-routing.module";

import { OrderPage } from "./order.page";
import { TranslateModule } from "@ngx-translate/core";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";
import { MomentPipeModule } from "src/app/pipes/moment/moment.module";
import { PricePipeModule } from "src/app/pipes/price/price.module";
import { StripeModule } from "stripe-angular";
import { environment } from "src/environments/environment";
import { FooterModule } from "src/app/components/footer/footer.module";
import { MonerisCheckoutComponent } from "src/app/pages/order/moneris-checkout/moneris-checkout.component";
import { MonerisHtComponent } from "src/app/pages/order/moneris-ht/moneris-ht.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderPageRoutingModule,
    TranslateModule.forChild(),
    LocalValueDirectiveModule,
    MomentPipeModule,
    PricePipeModule,
    StripeModule.forRoot(environment.stripe),
    FooterModule
  ],
  declarations: [OrderPage, MonerisCheckoutComponent, MonerisHtComponent]
})
export class OrderPageModule {}

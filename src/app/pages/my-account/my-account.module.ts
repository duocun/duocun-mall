import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { MyAccountPageRoutingModule } from "./my-account-routing.module";

import { MyAccountPage } from "./my-account.page";
import { TranslateModule } from "@ngx-translate/core";
import { IonImageModule } from "src/app/components/ion-image/ion-image.module";
import { PricePipeModule } from "src/app/pipes/price/price.module";
import { FooterModule } from "src/app/components/footer/footer.module";
import { LanguageButtonModule } from "src/app/components/language-button/language-button.module";
import { CartButtonModule } from "src/app/components/cart-button/cart-button.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyAccountPageRoutingModule,
    TranslateModule.forChild(),
    IonImageModule,
    PricePipeModule,
    FooterModule,
    LanguageButtonModule,
    CartButtonModule
  ],
  declarations: [MyAccountPage]
})
export class MyAccountPageModule {}

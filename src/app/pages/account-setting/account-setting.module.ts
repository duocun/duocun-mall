import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AccountSettingPageRoutingModule } from "./account-setting-routing.module";

import { AccountSettingPage } from "./account-setting.page";
import { TranslateModule } from "@ngx-translate/core";
import { LocationSearchModule } from "src/app/components/location-search/location-search.module";
import { DeliveryRangePageModule } from "../delivery-range/delivery-range.module";
import { FooterModule } from "src/app/components/footer/footer.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountSettingPageRoutingModule,
    TranslateModule.forChild(),
    LocationSearchModule,
    DeliveryRangePageModule,
    FooterModule
  ],
  declarations: [AccountSettingPage]
})
export class AccountSettingPageModule {}

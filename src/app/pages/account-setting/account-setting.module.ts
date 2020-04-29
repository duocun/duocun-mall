import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AccountSettingPageRoutingModule } from "./account-setting-routing.module";

import { AccountSettingPage } from "./account-setting.page";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountSettingPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [AccountSettingPage]
})
export class AccountSettingPageModule {}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { StaticPageRoutingModule } from "./static-page-routing.module";

import { StaticPage } from "./static-page.page";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";
import { FooterModule } from "src/app/components/footer/footer.module";
import { LanguageButtonModule } from "src/app/components/language-button/language-button.module";
import { CartButtonModule } from "src/app/components/cart-button/cart-button.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StaticPageRoutingModule,
    LocalValueDirectiveModule,
    FooterModule,
    LanguageButtonModule,
    CartButtonModule
  ],
  declarations: [StaticPage]
})
export class StaticPageModule {}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SearchPageRoutingModule } from "./search-routing.module";

import { SearchPage } from "./search.page";
import { TranslateModule } from "@ngx-translate/core";
import { ProductListModule } from "src/app/components/product-list/product-list.module";
import { LanguageButtonModule } from "src/app/components/language-button/language-button.module";
import { CartButtonModule } from "src/app/components/cart-button/cart-button.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPageRoutingModule,
    TranslateModule.forChild(),
    ProductListModule,
    LanguageButtonModule,
    CartButtonModule
  ],
  declarations: [SearchPage]
})
export class SearchPageModule {}

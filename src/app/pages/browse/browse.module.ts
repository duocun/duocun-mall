import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { BrowsePageRoutingModule } from "./browse-routing.module";

import { BrowsePage } from "./browse.page";
import { TranslateModule } from "@ngx-translate/core";
import { HttpClientModule } from "@angular/common/http";
import { LocationSearchModule } from "src/app/components/location-search/location-search.module";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";
import { IonImageModule } from "src/app/components/ion-image/ion-image.module";
import { MerchantListComponent } from "./merchant-list/merchant-list.component";
import { ProductListModule } from "src/app/components/product-list/product-list.module";
import { LanguageButtonModule } from "src/app/components/language-button/language-button.module";
import { FooterModule } from "src/app/components/footer/footer.module";
import { CartButtonModule } from "src/app/components/cart-button/cart-button.module";
import { ComponentsModule } from "src/app/components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrowsePageRoutingModule,
    TranslateModule.forChild(),
    HttpClientModule,
    LocationSearchModule,
    LocalValueDirectiveModule,
    IonImageModule,
    ProductListModule,
    LanguageButtonModule,
    CartButtonModule,
    ComponentsModule,
    FooterModule
  ],
  declarations: [BrowsePage, MerchantListComponent]
})
export class BrowsePageModule {}

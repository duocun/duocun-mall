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
import { PricePipeModule } from "src/app/pipes/price/price.module";
import { CategoryListModule } from "./category-list/category-list.module";

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
    PricePipeModule,
    CategoryListModule
  ],
  declarations: [BrowsePage, MerchantListComponent]
})
export class BrowsePageModule {}

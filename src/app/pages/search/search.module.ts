import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SearchPageRoutingModule } from "./search-routing.module";

import { SearchPage } from "./search.page";
import { TranslateModule } from "@ngx-translate/core";
import { ProductListModule } from "src/app/components/product-list/product-list.module";
import { ComponentsModule } from "src/app/components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPageRoutingModule,
    TranslateModule.forChild(),
    ProductListModule,
    ComponentsModule
  ],
  declarations: [SearchPage]
})
export class SearchPageModule {}

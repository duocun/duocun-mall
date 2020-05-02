import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CategoryPageRoutingModule } from "./category-routing.module";

import { CategoryPage } from "./category.page";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";
import { ProductListModule } from "src/app/components/product-list/product-list.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryPageRoutingModule,
    LocalValueDirectiveModule,
    ProductListModule
  ],
  declarations: [CategoryPage]
})
export class CategoryPageModule {}

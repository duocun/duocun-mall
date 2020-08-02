import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CategoryPageRoutingModule } from "./category-routing.module";

import { CategoryPage } from "./category.page";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";
import { ProductListModule } from "src/app/components/product-list/product-list.module";
import { CartButtonModule } from "src/app/components/cart-button/cart-button.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryPageRoutingModule,
    LocalValueDirectiveModule,
    ProductListModule,
    CartButtonModule
  ],
  declarations: [CategoryPage]
})
export class CategoryPageModule {}

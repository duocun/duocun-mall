import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CategoriesPageRoutingModule } from "./categories-routing.module";

import { CategoriesPage } from "./categories.page";
import { TranslateModule } from "@ngx-translate/core";
import { CategoryListModule } from "src/app/pages/browse/category-list/category-list.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriesPageRoutingModule,
    TranslateModule.forChild(),
    CategoryListModule
  ],
  declarations: [CategoriesPage]
})
export class CategoriesPageModule {}

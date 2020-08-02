import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CategoriesPageRoutingModule } from "./categories-routing.module";

import { CategoriesPage } from "./categories.page";
import { TranslateModule } from "@ngx-translate/core";
import { CartButtonModule } from "src/app/components/cart-button/cart-button.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriesPageRoutingModule,
    TranslateModule.forChild(),
    CartButtonModule
  ],
  declarations: [CategoriesPage]
})
export class CategoriesPageModule {}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SigninButtonComponent } from "./signin-button/signin-button.component";
import { IonicModule } from "@ionic/angular";
import { MatMenuModule } from "@angular/material/menu";
import { TranslateModule } from "@ngx-translate/core";
import { HeaderComponent } from "./header/header.component";
import { CartButtonModule } from "./cart-button/cart-button.module";
import { RouterModule } from "@angular/router";
import { LocalValueDirectiveModule } from "../directives/local-value.module";
import { CategoryListComponent } from "./category-list/category-list.component";
import { LanguageButtonComponent } from './language-button/language-button.component';
@NgModule({
  declarations: [
    LanguageButtonComponent,
    SigninButtonComponent, 
    HeaderComponent,
    CategoryListComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatMenuModule,
    RouterModule,
    TranslateModule.forChild(),
    LocalValueDirectiveModule,
    CartButtonModule
  ],
  exports: [
    HeaderComponent, 
    CategoryListComponent]
})
export class ComponentsModule {}

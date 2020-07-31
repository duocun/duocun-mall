import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SigninButtonComponent } from "./signin-button/signin-button.component";
import { IonicModule } from "@ionic/angular";
import { MatMenuModule } from "@angular/material/menu";
import { TranslateModule } from "@ngx-translate/core";
import { HeaderComponent } from "./header/header.component";
import { LanguageButtonModule } from "./language-button/language-button.module";
import { CartButtonModule } from "./cart-button/cart-button.module";
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [SigninButtonComponent, HeaderComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatMenuModule,
    RouterModule,
    TranslateModule.forChild(),
    LanguageButtonModule,
    CartButtonModule
  ],
  exports: [SigninButtonComponent, HeaderComponent]
})
export class ComponentsModule {}

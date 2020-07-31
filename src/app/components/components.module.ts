import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SigninButtonComponent } from "./signin-button/signin-button.component";
import { IonicModule } from "@ionic/angular";
import { MatMenuModule } from "@angular/material/menu";
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [SigninButtonComponent],
  imports: [CommonModule, IonicModule, MatMenuModule,TranslateModule.forChild()],
  exports: [SigninButtonComponent]
})
export class ComponentsModule {}

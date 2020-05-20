import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FooterComponent } from "./footer.component";
import { RouterModule } from "@angular/router";
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    TranslateModule.forChild()
  ],
  declarations: [FooterComponent],
  exports: [FooterComponent]
})
export class FooterModule {}
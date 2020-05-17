import { NgModule } from "@angular/core";
import { SideMenuComponent } from "./side-menu.component";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule.forChild(),
    LocalValueDirectiveModule,
    RouterModule.forChild([]),
    HttpClientModule
  ],
  declarations: [SideMenuComponent],
  exports: [SideMenuComponent]
})
export class SideMenuModule {}

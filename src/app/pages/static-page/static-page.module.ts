import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { StaticPageRoutingModule } from "./static-page-routing.module";

import { StaticPage } from "./static-page.page";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StaticPageRoutingModule,
    LocalValueDirectiveModule
  ],
  declarations: [StaticPage]
})
export class StaticPageModule {}

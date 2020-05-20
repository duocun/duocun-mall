import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { StaticPageRoutingModule } from "./static-page-routing.module";

import { StaticPage } from "./static-page.page";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";
import { FooterModule } from "src/app/components/footer/footer.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StaticPageRoutingModule,
    LocalValueDirectiveModule,
    FooterModule
  ],
  declarations: [StaticPage]
})
export class StaticPageModule {}

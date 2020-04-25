import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { BrowsePageRoutingModule } from "./browse-routing.module";

import { BrowsePage } from "./browse.page";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrowsePageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [BrowsePage]
})
export class BrowsePageModule {}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";
import { LocationSearchComponent } from "./location-search.component";
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule],
  declarations: [LocationSearchComponent],
  exports: [LocationSearchComponent]
})
export class LocationSearchModule {}

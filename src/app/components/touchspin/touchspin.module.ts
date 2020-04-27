import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { TouchspinComponent } from "./touchspin.component";

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [TouchspinComponent],
  exports: [TouchspinComponent]
})
export class TouchspinModule {}

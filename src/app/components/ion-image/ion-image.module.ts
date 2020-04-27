import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { IonImageComponent } from "./ion-image.component";

@NgModule({
  imports: [IonicModule, CommonModule],
  declarations: [IonImageComponent],
  exports: [IonImageComponent]
})
export class IonImageModule {}

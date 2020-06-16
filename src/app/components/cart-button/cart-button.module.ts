import { NgModule } from "@angular/core";
import { CartButtonComponent } from "./cart-button.component";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild([])],
  declarations: [CartButtonComponent],
  exports: [CartButtonComponent]
})
export class CartButtonModule {}

import { NgModule } from "@angular/core";
import { LanguageButtonComponent } from "./language-button.component";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild([])],
  declarations: [LanguageButtonComponent],
  exports: [LanguageButtonComponent]
})
export class LanguageButtonModule {}

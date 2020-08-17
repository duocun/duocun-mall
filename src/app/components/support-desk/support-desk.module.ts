import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { SupportDeskComponent } from "./support-desk.component";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([]),
    TranslateModule.forChild()
  ],
  declarations: [SupportDeskComponent],
  exports: [SupportDeskComponent]
})
export class SupportDeskModule {}

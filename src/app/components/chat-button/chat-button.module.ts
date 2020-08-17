import { NgModule } from "@angular/core";
import { ChatButtonComponent } from "./chat-button.component";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SupportDeskModule } from "../support-desk/support-desk.module";
import { SupportDeskComponent } from "../support-desk/support-desk.component";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([]),
    SupportDeskModule
  ],
  declarations: [ChatButtonComponent],
  exports: [ChatButtonComponent],
  entryComponents: [SupportDeskComponent]
})
export class ChatButtonModule {}

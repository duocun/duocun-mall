import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { SupportDeskComponent } from "../support-desk/support-desk.component";

@Component({
  selector: "chat-button",
  templateUrl: "./chat-button.component.html",
  styleUrls: ["./chat-button.component.scss"]
})
export class ChatButtonComponent implements OnInit {
  unread: number;
  modal: any;
  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.unread = 0;
    this.modal = null;
  }

  async showSupportDesk() {
    this.modal = await this.modalController.create({
      component: SupportDeskComponent,
      cssClass: "modal-support-desk",
      swipeToClose: true,
      keyboardClose: false,
      showBackdrop: false
    });
    return await this.modal.present();
  }
}

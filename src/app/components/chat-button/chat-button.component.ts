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
  isWechatBrowser = false;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.unread = 0;
    this.modal = null;
    const ua = navigator.userAgent.toLowerCase();
    if (ua.match(/micromessenger/i) && ua.match(/micromessenger/i).length > 0) {
      this.isWechatBrowser = true;
    }
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

import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { SocketService } from "src/app/services/socket/socket.service";
import { SupportDeskComponent } from "../support-desk/support-desk.component";

@Component({
  selector: "chat-button",
  templateUrl: "./chat-button.component.html",
  styleUrls: ["./chat-button.component.scss"]
})
export class ChatButtonComponent implements OnInit {
  modal: any;
  isWechatBrowser = false;

  constructor(
    private modalController: ModalController,
    private socketio: SocketService
  ) {}

  ngOnInit() {
    this.modal = null;
    const ua = navigator.userAgent.toLowerCase();
    if (ua.match(/micromessenger/i) && ua.match(/micromessenger/i).length > 0) {
      this.isWechatBrowser = true;
    }
  }

  getUnread(): number {
    return this.socketio.unread;
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

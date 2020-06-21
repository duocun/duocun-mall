import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: "support-desk",
  templateUrl: "./support-desk.component.html",
  styleUrls: ["./support-desk.component.scss"]
})
export class SupportDeskComponent implements OnInit {
  constructor(
    private modalController: ModalController,
    private socketService: SocketService
  ) {}

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }
}

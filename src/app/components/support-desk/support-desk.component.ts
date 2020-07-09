import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalController, AlertController } from "@ionic/angular";
import { SocketService } from "src/app/services/socket/socket.service";
import { TranslateService } from "@ngx-translate/core";
import { formatDate } from "@angular/common";
import { AuthService } from "src/app/services/auth/auth.service";

@Component({
  selector: "support-desk",
  templateUrl: "./support-desk.component.html",
  styleUrls: ["./support-desk.component.scss"]
})
export class SupportDeskComponent implements OnInit {
  @ViewChild("content", { static: false }) private content: any;
  @ViewChild("fileInput", { static: false }) private fileInput: any;

  // for sending message
  message: string = "";
  mediaUrl: String | ArrayBuffer = "";
  media: any = null;
  edit_message = false;

  // button disabled
  sendButtonDisabled: boolean = false;
  userId: string = "";
  messages: Array<any> = [];

  // for Infinite scroll
  allLoaded: Boolean = false;
  pageIndex: number = 0;

  today: Date = new Date();

  constructor(
    private modalController: ModalController,
    private socketio: SocketService,
    private alert: AlertController,
    private translator: TranslateService,
    private auth: AuthService
  ) {
    this.auth.getAccount().subscribe((account) => {
      if (account) {
        console.log(account);
        this.userId = account._id;
        this.getMessages(null);
      }
    });
  }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  getMessages(event: any) {
    // if logged in, get messages
    if (this.userId !== "") {
      if (event === null) {
        setTimeout(() => {
          this.content.scrollToBottom(-1);
        });
      }
    }

    this.allLoaded = true;
  }

  onClearImage(): void {
    this.mediaUrl = "";
    this.fileInput.nativeElement.value = "";
    this.media = null;
  }

  onSend(): void {
    if (!this.sendButtonDisabled) {
      if (this.message !== "" || this.media !== null) {
        if (this.message.length > 1000) {
          this.showAlert("Notice", "Maximum message length is 1000", "OK");
          return;
        }
        // const formData = new FormData();
        // formData.append('id', this.userId);
        // formData.append('content', this.message);
        // if (this.media) {
        //     formData.append('media', this.media);
        // }
        let sentData: any = {};
        sentData.id = this.userId;
        sentData.message = this.message;
        sentData.image = this.mediaUrl;
        sentData.createdAt = Date.now();
        console.log(sentData);

        this.socketio.sendMessage(sentData);

        this.messages.push({
          sender: sentData.id,
          message: sentData.message,
          imageData: sentData.image,
          created: sentData.createdAt
        });
        console.log(this.messages);

        // after sending message
        this.sendButtonDisabled = false;
        this.onClearImage();
        this.message = "";
      }
      // this.edit_message = false;
    }
  }

  getMessageDate(datetime): string {
    const todayDate = formatDate(this.today, "MM月 dd日", "en", "Asia/Tokyo");
    const date = formatDate(datetime, "MM月 dd日", "en", "Asia/Tokyo");
    if (todayDate === date) {
      return "";
    } else {
      return date;
    }
  }

  onFileChanged(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.media = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e) => {
        this.mediaUrl = reader.result;
      };
    }
  }

  showAlert(
    header = "Notice",
    message = "Please select delivery address",
    button = "OK"
  ) {
    this.translator.get([header, message, button]).subscribe((dict) => {
      this.alert
        .create({
          header: dict[header],
          message: dict[message],
          buttons: [dict[button]]
        })
        .then((alert) => {
          alert.present();
        });
    });
  }

  onKeyPress(event: any): void {
    if (event && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      this.onSend();
    }
  }

  // for infinite scroll
  loadData(event) {
    console.log("Load Messages...");
    this.getMessages(event);
  }
}

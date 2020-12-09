import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  Inject,
  PLATFORM_ID
} from "@angular/core";
import { ModalController, AlertController } from "@ionic/angular";
import { SocketService } from "src/app/services/socket/socket.service";
import { TranslateService } from "@ngx-translate/core";
import { formatDate, isPlatformBrowser } from "@angular/common";
import { AuthService } from "src/app/services/auth/auth.service";
import { ApiService } from "src/app/services/api/api.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "support-desk",
  templateUrl: "./support-desk.component.html",
  styleUrls: ["./support-desk.component.scss"]
})
export class SupportDeskComponent implements OnInit, OnDestroy {
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
  userName: string = "";
  messages: Array<any> = [];
  messageList: Array<any> = [];

  // for Infinite scroll
  allLoaded: Boolean = false;
  pageIndex: number = 0;

  today: Date = new Date();
  senderImageUrl: string = "";
  isCategorySelectionVisible: boolean = false;

  // for displaying welcome message
  welcomeMessage: string = "";
  messageCategory: string = "other";

  // for api
  private unsubscribe$ = new Subject<void>();

  // for receiving message
  receivedMessageSubscriber: any = null;

  constructor(
    @Inject(PLATFORM_ID) platformID: object,
    private modalController: ModalController,
    private socketio: SocketService,
    private alert: AlertController,
    private translator: TranslateService,
    private auth: AuthService,
    private api: ApiService
  ) {
    this.socketio.csUserid.subscribe((csUserId) => {
      if (csUserId) {
        this.userId = csUserId;
        if (isPlatformBrowser(platformID)) {
          if (!/like Mac OS X/.test(window.navigator.userAgent)) {
            this.getMessages(null);
          }
        }
        if (this.receivedMessageSubscriber === null) {
          this.receivedMessageSubscriber = this.socketio.receivedMessage.subscribe(
            (data) => {
              // update message to read state
              this.api.get(`/Messages/reset/${data._id}`).then((observable) => {
                observable
                  .pipe(takeUntil(this.unsubscribe$))
                  .subscribe((res: any) => {
                    if (res.code === "success") {
                      // reset message ok
                    }
                  });
              });

              this.messages.unshift(data);
              this.messageList.push(data);
              setTimeout(() => {
                this.content.scrollToBottom(300);
              }, 500);
            }
          );
        }
      }
    });
    this.auth.getAccount().subscribe((account) => {
      if (account) {
        this.senderImageUrl = account.imageurl;
        this.userName = account.username;
        localStorage.setItem("cs-userid", account._id);
        this.socketio.csUserid.next(account._id);
      }
    });
  }

  ngOnInit() {
    this.getSetting();
    this.resetMessages();
    this.socketio.tabOpened = true;
  }

  getSetting(): void {
    this.api.get(`/Setting`).then((observable) => {
      observable.pipe(takeUntil(this.unsubscribe$)).subscribe((res: any) => {
        if (res.code === "success" && res.data.welcomeMessage.trim() !== "") {
          this.welcomeMessage = res.data.welcomeMessage;
          const curMessage = {
            message: this.welcomeMessage,
            read: true,
            receiver: this.userId,
            receiverImg: "",
            sender: "manager",
            senderImg: "assets/img/manager.png",
            senderName: "hi",
            createdAt: Date.now().toString()
          };
          this.messages.push(curMessage);
          this.messageList.unshift(curMessage);

          setTimeout(() => {
            this.content.scrollToBottom(-1);
          }, 2000);
        }
      });
    });
  }

  resetMessages(): void {
    this.api.get(`/Messages/users/${this.userId}/reset`).then((observable) => {
      observable.pipe(takeUntil(this.unsubscribe$)).subscribe();
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.receivedMessageSubscriber.unsubscribe();
    this.socketio.tabOpened = false;
    this.socketio.unread = 0;
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  getMessages(event: any) {
    // if logged in, get messages
    if (this.userId !== "") {
      this.api
        .get(`/Messages/${this.userId}/${this.pageIndex}`)
        .then((observable) => {
          observable
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((res: any) => {
              if (res.code === "success") {
                if (event === null) {
                  setTimeout(() => {
                    this.content.scrollToBottom(-1);
                  }, 2000);

                  // get last category from messages
                  const lastIndex = res.data.findIndex(
                    (item) => item.receiver === this.userId
                  );
                  if (lastIndex > -1) {
                    this.messageCategory = res.data[lastIndex].category;
                  }
                }

                if (res.data.length < 1) {
                  this.allLoaded = true;
                } else {
                  if (res.data.length < 20) {
                    this.allLoaded = true;
                  }
                  if (res.data.length > 0) {
                    // check if any overlapping messages
                    let item: any;
                    let done = false;
                    let orgLength = this.messages.length;
                    while (!done) {
                      item = res.data.shift();
                      if (!item) break;
                      done = true;
                      for (let i = 0; i < orgLength; i++) {
                        if (
                          this.messages[orgLength - 1 - i].sender ===
                            item.sender &&
                          this.messages[orgLength - 1 - i].createdAt ===
                            item.createdAt
                        ) {
                          done = false;
                        }
                      }
                      if (done) {
                        this.messages.push(item);
                      }
                    }
                    if (done) {
                      this.messages.push(...res.data);
                    }
                    this.messageList = JSON.parse(
                      JSON.stringify(this.messages)
                    ).reverse();
                    this.pageIndex++;
                  }
                }
              }
              if (event) event.target.complete();
            });
        });
    }

    // this.allLoaded = true;
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

        let sentData: any = {};
        sentData.sender = this.userId;
        sentData.username = this.userName;
        sentData.message = this.message;
        sentData.senderImg = this.senderImageUrl;
        sentData.image = this.mediaUrl;
        sentData.createdAt = Date.now();
        sentData.category = this.messageCategory;

        // send message via socket
        this.socketio.sendMessage(sentData);

        this.messages.unshift(sentData);
        this.messageList.push(sentData);
        // scroll down to the element
        setTimeout(() => {
          this.content.scrollToBottom(300);
        }, 500);

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
    this.getMessages(event);
  }

  showCategorySelector(): void {
    this.isCategorySelectionVisible = !this.isCategorySelectionVisible;
  }
}

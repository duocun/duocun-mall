import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth/auth.service";
import { BehaviorSubject, Subject } from "rxjs";
import { Storage } from "@ionic/storage";
@Injectable({
  providedIn: "root"
})
export class SocketService {
  socket: any;
  mSocket: any;
  csUserid: BehaviorSubject<string>;
  receivedMessage: Subject<any>;

  constructor(private authSvc: AuthService, private storage: Storage) {
    this.receivedMessage = new Subject();
    this.csUserid = new BehaviorSubject<string>(
      localStorage.getItem("cs-userid")
    );
    this.mSocket = io(environment.socket);
    this.receiveSocket(this.mSocket);
  }

  async getToken() {
    let token = await this.authSvc.getToken();
    if (token) {
      return token;
    }
    token = await this.storage.get("duocun-socket-client-id");
    return token;
  }

  getUnreadMessages(data) {
    this.mSocket.emit("message_count", data);
  }

  receiveSocket(mSocket): void {
    mSocket.on("connect", (data) => {
      console.log("auto connect");
    });

    mSocket.on("id", (data) => {
      if (!localStorage.getItem("cs-userid")) {
        localStorage.setItem("cs-userid", data);
        this.csUserid.next(data);
      }
    });

    mSocket.on("to_customer", (data) => {
      this.receivedMessage.next(data);
    })
  }

  sendMessage(data: any) {
    this.mSocket.emit("customer_send", data);
  }

  joinCustomerServiceRoom(roomId: string){
    this.mSocket.emit("customer_init", {
      roomId: roomId
    });
  }
}

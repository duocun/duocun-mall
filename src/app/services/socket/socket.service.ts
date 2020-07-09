import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth/auth.service";
import { Storage } from "@ionic/storage";
@Injectable({
  providedIn: "root"
})
export class SocketService {
  socket: any;
  socket_message: any;
  constructor(private authSvc: AuthService, private storage: Storage) {
    this.socket_message = io(environment.server_url);
    this.receiveSocket(this.socket_message);
    this.getToken().then((token) => {
      console.log(token);
      this.socket = io(environment.api, {
        query: { token }
      });
    });
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
    this.socket_message.emit("message_count", data);
  }

  receiveSocket(socket_message): void {
    socket_message.on("connect", (data) => {
      console.log("auto connect");
    });

    socket_message.on("id", (data) => {
      console.log(`my id is ${data}`);
    });
  }

  sendMessage(data: any) {
    console.log("now sending data");
    this.socket_message.emit("customer_send", data);
  }
}

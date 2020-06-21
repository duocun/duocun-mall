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
  constructor(private authSvc: AuthService, private storage: Storage) {
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
}

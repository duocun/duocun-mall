import { Platform } from "@ionic/angular";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root"
})
export class AuthService {
  authState = new BehaviorSubject(true);

  constructor(private storage: Storage, private platform: Platform) {
    this.platform.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    this.storage.get(environment.storageKey.auth).then((res) => {
      if (res) {
        this.authState.next(true);
      } else {
        this.authState.next(false);
      }
    });
  }

  login(token: unknown) {
    return this.storage.set(environment.storageKey.auth, token).then(() => {
      this.authState.next(true);
    });
  }

  logout() {
    return this.storage.remove(environment.storageKey.auth).then(() => {
      this.authState.next(false);
    });
  }

  async getToken() {
    return new Promise((resolve) => {
      this.storage
        .get(environment.storageKey.auth)
        .then((token) => {
          resolve(token);
        })
        .catch(() => {
          resolve("");
        });
    });
  }
}

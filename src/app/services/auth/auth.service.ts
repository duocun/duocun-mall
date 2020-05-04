import { Platform } from "@ionic/angular";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";
import { AccountInterface } from "src/app/models/account.model";
import { HttpClient } from "@angular/common/http";
import { LocationService } from "src/app/services/location/location.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  authState = new BehaviorSubject(true);
  account: AccountInterface | null;
  account$: BehaviorSubject<AccountInterface>;
  constructor(
    private locSvc: LocationService,
    private storage: Storage,
    private platform: Platform,
    private http: HttpClient
  ) {
    this.platform.ready().then(() => {
      this.checkToken();
    });
    this.account = null;
    this.account$ = new BehaviorSubject<AccountInterface>(this.account);
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
    this.http
      .get(`${environment.api}/Accounts/G/token/${token}`)
      .subscribe((resp: { code: string; data: AccountInterface }) => {
        if (resp.code === "success") {
          this.account = resp.data;
          this.storage.set(environment.storageKey.auth, token).then(() => {
            this.account$.next(this.account);
            this.authState.next(true);
          });
          if (this.account.location) {
            this.locSvc.setLocation(
              this.account.location,
              this.account.location.address
            );
          } else {
            this.storage.remove(environment.storageKey.location);
          }
        } else {
          this.logout();
        }
      });
  }

  logout() {
    return this.storage.remove(environment.storageKey.auth).then(() => {
      this.account = null;
      this.account$.next(this.account);
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

  getAccount() {
    return this.account$;
  }

  async updateData() {
    const token = await this.getToken();
    this.login(token);
  }
}

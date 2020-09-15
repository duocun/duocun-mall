import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { from } from "rxjs";
import { concatMap } from "rxjs/operators";

import * as queryString from "query-string";
import { AuthService } from "src/app/services/auth/auth.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  apiHost: string;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.apiHost = environment.api;
  }

  buildUrl(url, param = null) {
    url = this.apiHost + (url.startsWith("/") ? url : `/${url}`);
    if (!param) {
      return url;
    }
    if (typeof param === "string") {
      return url + param;
    }
    if (typeof param === "object") {
      return `${url}?${queryString.stringify(param)}`;
    }
    return url;
  }
  async buildAuthHeader() {
    const token = await this.auth.getToken();
    if (token) {
      return {
        headers: new HttpHeaders().set("Authorization", `Bearer ${token}`)
      };
    } else {
      return {};
    }
  }
  async get(url, param = null, auth = true, isRelative = true) {
    if (isRelative) {
      url = this.buildUrl(url, param);
    }
    if (auth) {
      const authHeader = await this.buildAuthHeader();
      return this.http.get(url, authHeader);
    } else {
      return this.http.get(url);
    }
  }

  // get with header
  async geth(url, param = null, auth = true, key = "data") {
    url = this.buildUrl(url);
    let headers;
    if (auth) {
      const authHeader = await this.buildAuthHeader();
      headers = authHeader.headers ? authHeader.headers : new HttpHeaders();
    } else {
      headers = new HttpHeaders();
    }
    headers = headers.append(key, JSON.stringify(param));
    return new Promise((resolve, reject) => {
      this.http
        .get(url, { headers })
        .toPromise()
        .then((resp: any) => {
          resolve(resp);
        });
    });
  }
  async post(url, param = null, auth = true, isRelative = true) {
    if (isRelative) {
      url = this.buildUrl(url);
    }
    if (auth) {
      const authHeader = await this.buildAuthHeader();
      return this.http.post(url, param, authHeader);
    } else {
      return this.http.post(url, param);
    }
  }
  async put(url, param = null, auth = true, isRelative = true) {
    if (isRelative) {
      url = this.buildUrl(url);
    }
    if (auth) {
      const authHeader = await this.buildAuthHeader();
      return this.http.put(url, param, authHeader);
    } else {
      return this.http.put(url, param);
    }
  }
  async patch(url, param = null, auth = true, isRelative = true) {
    if (isRelative) {
      url = this.buildUrl(url);
    }
    if (auth) {
      const authHeader = await this.buildAuthHeader();
      return this.http.patch(url, param, authHeader);
    } else {
      return this.http.patch(url, param);
    }
  }
  async delete(url, param = null, auth = true, isRelative = true) {
    if (isRelative) {
      url = this.buildUrl(url, param);
    }
    if (auth) {
      const authHeader = await this.buildAuthHeader();
      return this.http.delete(url, authHeader);
    } else {
      return this.http.delete(url);
    }
  }

  // v2 observable
  getV2(url, param = null, auth = true, isRelative = true) {
    if (isRelative) {
      url = this.buildUrl(url, param);
    }
    if (auth) {
      return from(this.buildAuthHeader()).pipe(
        concatMap((authHeader) => this.http.get(url, authHeader))
      );
    } else {
      return this.http.get(url);
    }
  }

  postV2(url, param = null, auth = true, isRelative = true) {
    if (isRelative) {
      url = this.buildUrl(url);
    }
    if (auth) {
      return from(this.buildAuthHeader()).pipe(
        concatMap((authHeader) => this.http.post(url, param, authHeader))
      );
    } else {
      return this.http.post(url, param);
    }
  }
}

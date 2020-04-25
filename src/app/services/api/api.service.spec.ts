import { TestBed } from '@angular/core/testing';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';

describe("ApiService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      IonicStorageModule.forRoot(),
      HttpClientModule
    ]
  }));
  it("should be created", () => {
    const service: ApiService = TestBed.get(ApiService);
    expect(service).toBeTruthy();
  });
  
  describe("buildUrl", () => {
    it("should prepend api url to given url", () => {
      const service: ApiService = TestBed.get(ApiService);
      const url = "bravemaster619";
      expect(service.buildUrl(url)).toEqual(environment.api + "/bravemaster619");
    });
    it("should ignore slash if given url already contains one", () => {
      const service: ApiService = TestBed.get(ApiService);
      const url = "/bravemaster619";
      expect(service.buildUrl(url)).toEqual(environment.api + "/bravemaster619");
    });
    it("should build a query string for given parameter", () => {
      const service: ApiService = TestBed.get(ApiService);
      const url = "/bravemaster619";
      const param = {
        foo: "bar",
        bar: "baz"
      };
      expect(service.buildUrl(url, param)).toEqual(environment.api + "/bravemaster619?bar=baz&foo=bar");
    });
  });

  describe("buildAuthHeader", () => {
    it("should return empty object when user is not authenticated", (done) => {
      const auth: AuthService = TestBed.get(AuthService);
      const api: ApiService = TestBed.get(ApiService);
      auth.logout().then(() => {
        api.buildAuthHeader().then(header => {
          expect(header).toEqual({});
          done();
        });
      });
    });
    it("should return http header object when user is authenticated", (done) => {
      const auth: AuthService = TestBed.get(AuthService);
      const api: ApiService = TestBed.get(ApiService);
      auth.login("my token").then(() => {
        api.buildAuthHeader().then(header => {
          const headers = header.headers;
          expect(headers.get("Authorization")).toEqual("Bearer my token");
          done();
        })
      })
    });
  });

});
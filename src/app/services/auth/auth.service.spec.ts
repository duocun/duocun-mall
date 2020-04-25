import { TestBed } from "@angular/core/testing";
import { IonicStorageModule } from "@ionic/storage";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [IonicStorageModule.forRoot()]
    })
  );

  it("should be created", () => {
    const auth: AuthService = TestBed.get(AuthService);
    expect(auth).toBeTruthy();
  });

  it("store authentication token after login", (done) => {
    const auth: AuthService = TestBed.get(AuthService);
    auth.login("my token").then(() => {
      auth.getToken().then((token) => {
        expect(token).toEqual("my token");
        done();
      });
    });
  });

  it("remove authentication token after log out", (done) => {
    const auth: AuthService = TestBed.get(AuthService);
    auth.login("my token").then(() => {
      auth.logout().then(() => {
        auth.getToken().then((token) => {
          expect(token).toBeFalsy();
          done();
        });
      });
    });
  });
});

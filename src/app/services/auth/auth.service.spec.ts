import { TestBed } from "@angular/core/testing";
import { IonicStorageModule } from "@ionic/storage";
import { AuthService } from "./auth.service";
import { HttpClientModule } from "@angular/common/http";

describe("AuthService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [IonicStorageModule.forRoot(), HttpClientModule]
    })
  );

  it("should be created", () => {
    const auth: AuthService = TestBed.get(AuthService);
    expect(auth).toBeTruthy();
  });
});

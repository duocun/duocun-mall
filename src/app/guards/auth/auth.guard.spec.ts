import { TestBed, async, inject } from "@angular/core/testing";
import { IonicStorageModule } from "@ionic/storage";
import { AuthGuard } from "./auth.guard";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { HttpClientModule } from "@angular/common/http";

describe("AuthGuard", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicStorageModule.forRoot(),
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
        HttpClientModule
      ],
      providers: [AuthGuard]
    });
  });

  it("should create an auth guard", inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});

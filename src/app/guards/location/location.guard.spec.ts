import { TestBed, async, inject } from "@angular/core/testing";
import { IonicStorageModule } from "@ionic/storage";
import { LocationGuard } from "./location.guard";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { HttpClientModule } from "@angular/common/http";

describe("LocationGuard", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicStorageModule.forRoot(),
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
        HttpClientModule
      ],
      providers: [LocationGuard]
    });
  });

  it("should create a location guard", inject(
    [LocationGuard],
    (guard: LocationGuard) => {
      expect(guard).toBeTruthy();
    }
  ));
});

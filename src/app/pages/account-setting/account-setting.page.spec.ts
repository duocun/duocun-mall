import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { AccountSettingPage } from "./account-setting.page";
import { TranslateModule } from "@ngx-translate/core";
import { HttpClientModule } from "@angular/common/http";
import { IonicStorageModule } from "@ionic/storage";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { LocationSearchModule } from "src/app/components/location-search/location-search.module";

describe("AccountSettingPage", () => {
  let component: AccountSettingPage;
  let fixture: ComponentFixture<AccountSettingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountSettingPage],
      imports: [
        IonicModule.forRoot(),
        TranslateModule.forRoot(),
        HttpClientModule,
        IonicStorageModule.forRoot(),
        FormsModule,
        RouterModule.forRoot([]),
        LocationSearchModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountSettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

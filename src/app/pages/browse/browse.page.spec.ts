import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { BrowsePage } from "./browse.page";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { LocationSearchModule } from "src/app/components/location-search/location-search.module";
import { IonImageModule } from "src/app/components/ion-image/ion-image.module";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";
import { IonicStorageModule } from "@ionic/storage";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule } from '@angular/forms';
import { CategoryListComponent } from './category-list/category-list.component';
import { MerchantListComponent } from './merchant-list/merchant-list.component';
describe("BrowsePage", () => {
  let component: BrowsePage;
  let fixture: ComponentFixture<BrowsePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrowsePage, CategoryListComponent, MerchantListComponent],
      imports: [
        IonicModule.forRoot(),
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: "tabs/my-account/setting",
            loadChildren: () =>
              import("../account-setting/account-setting.module").then(
                (m) => m.AccountSettingPageModule
              )
          }
        ]),
        LocationSearchModule,
        IonImageModule,
        LocalValueDirectiveModule,
        IonicStorageModule.forRoot(),
        FormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BrowsePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { BrowsePage } from "./browse.page";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { LocationSearchModule } from 'src/app/components/location-search/location-search.module';
import { IonImageModule } from 'src/app/components/ion-image/ion-image.module';
import { LocalValueDirectiveModule } from 'src/app/directives/local-value.module';
import { IonicStorageModule } from "@ionic/storage";

describe("BrowsePage", () => {
  let component: BrowsePage;
  let fixture: ComponentFixture<BrowsePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrowsePage],
      imports: [
        IonicModule.forRoot(),
        TranslateModule.forRoot(),
        RouterModule.forRoot([]),
        LocationSearchModule,
        IonImageModule,
        LocalValueDirectiveModule,
        IonicStorageModule.forRoot()
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

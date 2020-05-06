import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { DeliveryRangePage } from "./delivery-range.page";
import { HttpClientModule } from "@angular/common/http";
import { TranslateModule } from "@ngx-translate/core";
import { AgmCoreModule } from "@agm/core";
import { IonicStorageModule } from "@ionic/storage";
import { RouterModule } from "@angular/router";

describe("DeliveryRangePage", () => {
  let component: DeliveryRangePage;
  let fixture: ComponentFixture<DeliveryRangePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryRangePage],
      imports: [
        IonicModule.forRoot(),
        HttpClientModule,
        TranslateModule.forRoot(),
        AgmCoreModule.forRoot(),
        IonicStorageModule.forRoot(),
        RouterModule.forRoot([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeliveryRangePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

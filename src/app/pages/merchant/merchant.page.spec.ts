import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { MerchantPage } from "./merchant.page";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";
import { IonImageModule } from "src/app/components/ion-image/ion-image.module";
import { PricePipeModule } from "src/app/pipes/price/price.module";
import { HttpClientModule } from "@angular/common/http";
import { IonicStorageModule } from "@ionic/storage";
import { RouterModule } from "@angular/router";

describe("MerchantPage", () => {
  let component: MerchantPage;
  let fixture: ComponentFixture<MerchantPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MerchantPage],
      imports: [
        IonicModule.forRoot(),
        LocalValueDirectiveModule,
        IonImageModule,
        PricePipeModule,
        HttpClientModule,
        IonicStorageModule.forRoot(),
        RouterModule.forRoot([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MerchantPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { CartPage } from "./cart.page";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { IonImageModule } from "src/app/components/ion-image/ion-image.module";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";
import { PricePipeModule } from "src/app/pipes/price/price.module";
import { MomentPipeModule } from "src/app/pipes/moment/moment.module";
import { TouchspinModule } from "src/app/components/touchspin/touchspin.module";
import { IonicStorageModule } from "@ionic/storage";
import { HttpClientModule } from '@angular/common/http';

describe("CartPage", () => {
  let component: CartPage;
  let fixture: ComponentFixture<CartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CartPage],
      imports: [
        IonicModule.forRoot(),
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
        IonImageModule,
        LocalValueDirectiveModule,
        PricePipeModule,
        MomentPipeModule,
        TouchspinModule,
        IonicStorageModule.forRoot(),
        HttpClientModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

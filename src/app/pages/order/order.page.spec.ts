import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { OrderPage } from "./order.page";
import { TranslateModule } from "@ngx-translate/core";
import { HttpClientModule } from "@angular/common/http";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";
import { PricePipeModule } from "src/app/pipes/price/price.module";
import { MomentPipeModule } from "src/app/pipes/moment/moment.module";
import { IonicStorageModule } from "@ionic/storage";

describe("OrderPage", () => {
  let component: OrderPage;
  let fixture: ComponentFixture<OrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderPage],
      imports: [
        IonicModule.forRoot(),
        TranslateModule.forRoot(),
        HttpClientModule,
        LocalValueDirectiveModule,
        PricePipeModule,
        MomentPipeModule,
        IonicStorageModule.forRoot()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

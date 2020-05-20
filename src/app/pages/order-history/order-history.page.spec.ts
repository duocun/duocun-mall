import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { OrderHistoryPage } from "./order-history.page";
import { TranslateModule } from "@ngx-translate/core";
import { PricePipeModule } from "src/app/pipes/price/price.module";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";
import { MomentPipeModule } from "src/app/pipes/moment/moment.module";
import { HttpClientModule } from "@angular/common/http";
import { IonicStorageModule } from "@ionic/storage";
import { RouterModule } from "@angular/router";
import { FooterModule } from "src/app/components/footer/footer.module";

describe("OrderHistoryPage", () => {
  let component: OrderHistoryPage;
  let fixture: ComponentFixture<OrderHistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderHistoryPage],
      imports: [
        IonicModule.forRoot(),
        PricePipeModule,
        LocalValueDirectiveModule,
        MomentPipeModule,
        HttpClientModule,
        IonicStorageModule.forRoot(),
        TranslateModule.forRoot(),
        RouterModule.forRoot([]),
        FooterModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

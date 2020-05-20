import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { OrderPage } from "./order.page";
import { TranslateModule } from "@ngx-translate/core";
import { HttpClientModule } from "@angular/common/http";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";
import { PricePipeModule } from "src/app/pipes/price/price.module";
import { MomentPipeModule } from "src/app/pipes/moment/moment.module";
import { IonicStorageModule } from "@ionic/storage";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { environment } from "src/environments/environment";
import { StripeModule } from "stripe-angular";
import { FooterModule } from 'src/app/components/footer/footer.module';

describe("OrderPage", () => {
  let component: OrderPage;
  let fixture: ComponentFixture<OrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderPage],
      imports: [
        FormsModule,
        IonicModule.forRoot(),
        TranslateModule.forRoot(),
        HttpClientModule,
        LocalValueDirectiveModule,
        PricePipeModule,
        MomentPipeModule,
        IonicStorageModule.forRoot(),
        RouterModule.forRoot([
          {
            path: "tabs/browse",
            loadChildren: () =>
              import("../browse/browse.module").then((m) => m.BrowsePageModule)
          }
        ]),
        StripeModule.forRoot(environment.stripe),
        FooterModule
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

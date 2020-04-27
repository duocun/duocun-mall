import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { ProductPage } from "./product.page";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";
import { IonImageModule } from "src/app/components/ion-image/ion-image.module";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { IonicStorageModule } from "@ionic/storage";
import { TouchspinModule } from "src/app/components/touchspin/touchspin.module";
import { PricePipeModule } from "src/app/pipes/price/price.module";
import { TranslateModule } from "@ngx-translate/core";
import { MomentPipeModule } from "src/app/pipes/moment/moment.module";

describe("ProductPage", () => {
  let component: ProductPage;
  let fixture: ComponentFixture<ProductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductPage],
      imports: [
        IonicModule.forRoot(),
        LocalValueDirectiveModule,
        IonImageModule,
        RouterModule.forRoot([]),
        HttpClientModule,
        IonicStorageModule.forRoot(),
        TouchspinModule,
        PricePipeModule,
        TranslateModule.forRoot(),
        MomentPipeModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

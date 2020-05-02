import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { ProductListComponent } from "./product-list.component";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";
import { IonImageModule } from "src/app/components/ion-image/ion-image.module";
import { PricePipeModule } from "src/app/pipes/price/price.module";
import { TranslateModule } from "@ngx-translate/core";

describe("ProductListComponent", () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      imports: [
        IonicModule.forRoot(),
        LocalValueDirectiveModule,
        IonImageModule,
        PricePipeModule,
        TranslateModule.forRoot()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

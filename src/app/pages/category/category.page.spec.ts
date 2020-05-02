import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { CategoryPage } from "./category.page";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";
import { ProductListModule } from "src/app/components/product-list/product-list.module";
import { IonicStorageModule } from "@ionic/storage";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { TranslateModule } from "@ngx-translate/core";

describe("CategoryPage", () => {
  let component: CategoryPage;
  let fixture: ComponentFixture<CategoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryPage],
      imports: [
        IonicModule.forRoot(),
        LocalValueDirectiveModule,
        ProductListModule,
        IonicStorageModule.forRoot(),
        RouterModule.forRoot([]),
        HttpClientModule,
        TranslateModule.forRoot()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

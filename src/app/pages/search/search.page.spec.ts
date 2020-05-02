import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { SearchPage } from "./search.page";
import { TranslateModule } from "@ngx-translate/core";
import { ProductListModule } from "src/app/components/product-list/product-list.module";
import { RouterModule } from "@angular/router";
import { IonicStorageModule } from "@ionic/storage";

describe("SearchPage", () => {
  let component: SearchPage;
  let fixture: ComponentFixture<SearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchPage],
      imports: [
        IonicModule.forRoot(),
        TranslateModule.forRoot(),
        ProductListModule,
        RouterModule.forRoot([]),
        IonicStorageModule.forRoot()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

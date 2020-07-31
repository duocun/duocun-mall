import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { CategoriesPage } from "./categories.page";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { HttpClientModule } from "@angular/common/http";
import { IonicStorageModule } from "@ionic/storage";

describe("CategoriesPage", () => {
  let component: CategoriesPage;
  let fixture: ComponentFixture<CategoriesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriesPage],
      imports: [
        IonicModule.forRoot(),
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
        HttpClientModule,
        IonicStorageModule.forRoot()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

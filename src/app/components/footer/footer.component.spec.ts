import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { FooterComponent } from "./footer.component";
import { RouterModule } from '@angular/router';
import { HomePage } from "src/app/pages/home/home.page";
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';

describe("FooterComponent", () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [
        IonicModule.forRoot(),
        RouterModule.forRoot([
          {
            path: "page",
            component: HomePage,
            loadChildren: () =>
              import("../../pages/static-page/static-page.module").then(
                (m) => m.StaticPageModule
              )
          }
        ]),
        TranslateModule.forRoot(),
        HttpClientModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { HomePage } from "./home.page";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { IonicStorageModule } from "@ionic/storage";

describe("HomePage", () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [
        HttpClientModule,
        IonicModule.forRoot(),
        TranslateModule.forRoot(),
        RouterModule.forRoot([]),
        IonicStorageModule.forRoot()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

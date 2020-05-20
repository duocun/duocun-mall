import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { StaticPage } from "./static-page.page";
import { LocalValueDirectiveModule } from "src/app/directives/local-value.module";
import { HttpClientModule } from "@angular/common/http";
import { TranslateModule } from "@ngx-translate/core";
import { IonicStorageModule } from "@ionic/storage";
import { FooterModule } from 'src/app/components/footer/footer.module';

describe("StaticPage", () => {
  let component: StaticPage;
  let fixture: ComponentFixture<StaticPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StaticPage],
      imports: [
        IonicModule.forRoot(),
        LocalValueDirectiveModule,
        HttpClientModule,
        IonicStorageModule.forRoot(),
        TranslateModule.forRoot(),
        RouterModule.forRoot([
          {
            path: "tabs/browse",
            loadChildren: () =>
              import("../browse/browse.module").then((m) => m.BrowsePageModule)
          }
        ]),
        FooterModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StaticPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

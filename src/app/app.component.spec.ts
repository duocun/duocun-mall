import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";

import { TestBed, async } from "@angular/core/testing";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { createTranslateLoader } from "./app.module";
import { IonicStorageModule } from "@ionic/storage";
import { RouterModule } from "@angular/router";

describe("AppComponent", () => {
  let statusBarSpy, splashScreenSpy, platformReadySpy, platformSpy;

  beforeEach(async(() => {
    statusBarSpy = jasmine.createSpyObj("StatusBar", ["styleDefault"]);
    splashScreenSpy = jasmine.createSpyObj("SplashScreen", ["hide"]);
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj("Platform", { ready: platformReadySpy });

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
          }
        }),
        IonicStorageModule.forRoot(),
        RouterModule.forRoot([
          {
            path: "tabs/my-account/transaction-history",
            loadChildren: () =>
              import(
                "./pages/transaction-history/transaction-history.module"
              ).then((m) => m.TransactionHistoryPageModule)
          },
          {
            path: "tabs/my-account/order-history",
            loadChildren: () =>
              import("./pages/my-account/my-account.module").then(
                (m) => m.MyAccountPageModule
              )
          }
        ])
      ],
      providers: [
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: platformSpy }
      ]
    }).compileComponents();
  }));

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it("should initialize the app", async () => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();
    await platformReadySpy;
    expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    expect(splashScreenSpy.hide).toHaveBeenCalled();
  });

  // TODO: add more tests!
});

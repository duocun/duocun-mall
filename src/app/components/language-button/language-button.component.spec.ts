import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { LanguageButtonComponent } from "./language-button.component";
import { RouterModule } from "@angular/router";
import { IonicStorageModule } from "@ionic/storage";
import { HttpClientModule } from "@angular/common/http";

describe("LanguageButtonComponent", () => {
  let component: LanguageButtonComponent;
  let fixture: ComponentFixture<LanguageButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LanguageButtonComponent],
      imports: [
        IonicModule.forRoot(),
        RouterModule.forRoot([]),
        IonicStorageModule.forRoot(),
        HttpClientModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

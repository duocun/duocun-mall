import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { BrowsePage } from "./browse.page";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";

describe("BrowsePage", () => {
  let component: BrowsePage;
  let fixture: ComponentFixture<BrowsePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrowsePage],
      imports: [
        IonicModule.forRoot(),
        TranslateModule.forRoot(),
        RouterModule.forRoot([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BrowsePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { SupportDeskComponent } from "./support-desk.component";

describe("SupportDeskComponent", () => {
  let component: SupportDeskComponent;
  let fixture: ComponentFixture<SupportDeskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SupportDeskComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SupportDeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

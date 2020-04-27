import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { TouchspinComponent } from "./touchspin.component";

describe("TouchspinComponent", () => {
  let component: TouchspinComponent;
  let fixture: ComponentFixture<TouchspinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TouchspinComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TouchspinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { TransactionHistoryPage } from "./transaction-history.page";
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageModule } from '@ionic/storage';
import { MomentPipeModule } from 'src/app/pipes/moment/moment.module';
import { PricePipeModule } from 'src/app/pipes/price/price.module';
import { RouterModule } from '@angular/router';

describe("TransactionHistoryPage", () => {
  let component: TransactionHistoryPage;
  let fixture: ComponentFixture<TransactionHistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionHistoryPage],
      imports: [
        IonicModule.forRoot(),
        HttpClientModule,
        TranslateModule.forRoot(),
        IonicStorageModule.forRoot(),
        MomentPipeModule,
        PricePipeModule,
        RouterModule.forRoot([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

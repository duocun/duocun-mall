import { Component, OnInit, OnDestroy } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

declare const monerisCheckout: any;

@Component({
  selector: "moneris-checkout",
  templateUrl: "./moneris-checkout.component.html",
  styleUrls: ["./moneris-checkout.component.scss"]
})
export class MonerisCheckoutComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

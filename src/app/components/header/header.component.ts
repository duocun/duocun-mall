import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter
} from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { AuthService } from "src/app/services/auth/auth.service";
import { Subject } from "rxjs";
import { AccountInterface } from "src/app/models/account.model";

@Component({
  selector: "header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() menu; // bool
  @Input() back; // {url: "/tabs/cart", text:""}
  @Input() title; // {text: ""} // "Confirm Order"

  @Input() search; // bool
  @Input() searchKeyword; // text
  @Output() onSearch = new EventEmitter();

  account: AccountInterface;
  private unsubscribe$ = new Subject<void>();

  constructor(private authSvc: AuthService) {}

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  ngOnInit() {
    this.authSvc
      .getAccount()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((account) => {
        this.account = account;
      });
  }

  handleSearch($event) {
    this.onSearch.emit($event);
  }
}

import { Component, OnInit, OnDestroy } from "@angular/core";
import { OrderInterface, OrderType } from "src/app/models/order.model";
import { ApiService } from "src/app/services/api/api.service";
import { AuthService } from "src/app/services/auth/auth.service";
import { AccountInterface } from "src/app/models/account.model";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
@Component({
  selector: "app-order-history",
  templateUrl: "./order-history.page.html",
  styleUrls: ["./order-history.page.scss"]
})
export class OrderHistoryPage implements OnInit, OnDestroy {
  loading: boolean;
  orders: Array<OrderInterface>;
  page: number;
  pageLength: number;
  accountId: string;
  scrollDisabled: boolean;
  OrderTypes = OrderType;
  private unsubscribe$ = new Subject<void>();
  constructor(private api: ApiService, private authSvc: AuthService) {
    this.loading = true;
    this.orders = [];
    this.page = 1;
    this.pageLength = 10;
    this.accountId = "";
    this.scrollDisabled = false;
  }

  ngOnInit() {
    this.authSvc.getAccount().subscribe((account: AccountInterface) => {
      if (account && account._id) {
        this.accountId = account._id;
        this.updatePage(null);
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadData(event) {
    this.page++;
    this.updatePage(event);
  }

  updatePage(event) {
    this.api
      .geth(
        `Orders/history/${this.page}/${this.pageLength}`,
        {
          clientId: this.accountId
        },
        true,
        "filter"
      )
      .pipe(takeUntil(this.unsubscribe$))
      .then((data: { orders: Array<OrderInterface>; total: number }) => {
        console.log("order history page history subscription");
        this.orders = [...this.orders, ...data.orders];
        this.loading = false;
        if (event) {
          event.target.complete();
          if (this.orders.length === data.total) {
            this.scrollDisabled = true;
          }
        }
      });
  }
}

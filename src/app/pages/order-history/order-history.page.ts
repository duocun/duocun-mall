import { Component, OnInit, OnDestroy } from "@angular/core";
import { OrderInterface, OrderType } from "src/app/models/order.model";
import { ApiService } from "src/app/services/api/api.service";
import { AuthService } from "src/app/services/auth/auth.service";
import { AccountInterface } from "src/app/models/account.model";
import { Subject } from "rxjs";

@Component({
  selector: "app-order-history",
  templateUrl: "./order-history.page.html",
  styleUrls: ["./order-history.page.scss"]
})
export class OrderHistoryPage implements OnInit, OnDestroy {
  loading: boolean;
  groupedOrders: Array<Array<OrderInterface>>;
  page: number;
  pageLength: number;
  accountId: string;
  scrollDisabled: boolean;
  OrderTypes = OrderType;
  title = "Order History";
  backBtn = { url: "/tabs/my-account", text: "" };
  private unsubscribe$ = new Subject<void>();
  constructor(private api: ApiService, private authSvc: AuthService) {
    this.loading = true;
    this.groupedOrders = [];
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
      .then((data: { data: Array<Array<OrderInterface>>; total: number }) => {
        console.log("order history page history subscription");
        this.groupedOrders = [...this.groupedOrders, ...data.data];
        this.loading = false;
        if (event) {
          event.target.complete();
          if (this.groupedOrders.length === data.total) {
            this.scrollDisabled = true;
          }
        }
      });
  }

  getGroupOrderCode(group: Array<OrderInterface>) {
    return group.map((order) => order.code).join("-");
  }
  getGroupValue(group: Array<OrderInterface>, key: string): number {
    let total = 0;
    group.forEach((order) => {
      total += parseFloat(order[key] || 0);
    });
    return total;
  }
}

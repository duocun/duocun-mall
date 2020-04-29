import { Component, OnInit } from "@angular/core";
import { OrderInterface, OrderType } from "src/app/models/order.model";
import { ApiService } from "src/app/services/api/api.service";
import { AuthService } from "src/app/services/auth/auth.service";
import { AccountInterface } from "src/app/models/account.model";

@Component({
  selector: "app-order-history",
  templateUrl: "./order-history.page.html",
  styleUrls: ["./order-history.page.scss"]
})
export class OrderHistoryPage implements OnInit {
  loading: boolean;
  orders: Array<OrderInterface>;
  page: number;
  pageLength: number;
  accountId: string;
  scrollDisabled: boolean;
  OrderTypes = OrderType;
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
        this.loading = false;
        this.updatePage(null);
      }
    });
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
      .then((data: { orders: Array<OrderInterface>; total: number }) => {
        this.orders = [...this.orders, ...data.orders];
        if (event) {
          event.target.complete();
          if (this.orders.length === data.total) {
            console.log("order length and total matching disabled");
            this.scrollDisabled = true;
          }
        }
      });
  }
}

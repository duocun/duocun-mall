import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "src/app/services/api/api.service";
import { OrderInterface, OrderType } from "src/app/models/order.model";
import { AuthService } from "src/app/services/auth/auth.service";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"]
})
export class DetailComponent implements OnInit {
  orders: Array<OrderInterface>;
  loading: boolean;
  scope: "order" | "payment";
  code: string;
  accountId: string;
  OrderTypes = OrderType;
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private authSvc: AuthService
  ) {
    this.orders = [];
    this.loading = true;
    this.scope = "order";
  }

  ngOnInit() {
    this.authSvc.getAccount().subscribe((account) => {
      if (account && account._id) {
        this.accountId = account._id;
        this.route.params.subscribe((param) => {
          this.scope = param.scope || "order";
          this.code = param.code || "";
          this.loadData();
        });
      }
    });
  }

  loadData() {
    if (this.scope === "order") {
      this.api
        .geth(
          `Orders/getByCode/${this.code}`,
          {
            clientId: this.accountId
          },
          true,
          "filter"
        )
        .then((resp: { code: string; data: any }) => {
          this.orders = [resp.data];
        })
        .finally(() => {
          this.loading = false;
        });
    } else if (this.scope === "payment") {
      this.api
        .geth(
          `Orders/getByPaymentId/${this.code}`,
          {
            clientId: this.accountId
          },
          true,
          "filter"
        )
        .then((resp: { code: string; data: any }) => {
          this.orders = resp.data;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
}

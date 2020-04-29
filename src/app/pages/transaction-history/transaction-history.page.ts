import { Component, OnInit } from "@angular/core";
import { TransactionInterface } from "src/app/models/transaction.model";
import { getTransactionDescription } from "src/app/models/transaction.model";
import { AuthService } from "src/app/services/auth/auth.service";
import { AccountInterface } from "src/app/models/account.model";
import { ApiService } from "src/app/services/api/api.service";

@Component({
  selector: "app-transaction-history",
  templateUrl: "./transaction-history.page.html",
  styleUrls: ["./transaction-history.page.scss"]
})
export class TransactionHistoryPage implements OnInit {
  loading: boolean;
  transactions: Array<TransactionInterface>;
  accountId: string;
  page: number;
  pageLength: number;
  scrollDisabled: boolean;
  constructor(private authSvc: AuthService, private api: ApiService) {
    this.loading = true;
    this.transactions = [];
    this.page = 1;
    this.pageLength = 15;
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

  loadData(event) {
    this.page++;
    this.updatePage(event);
  }

  updatePage(event) {
    this.api
      .geth(
        `Transactions/loadPage/${this.page}/${this.pageLength}`,
        {
          $or: [
            {
              fromId: this.accountId,
              toId: this.accountId
            }
          ],
          amount: {
            $ne: 0
          }
        },
        true,
        "filter"
      )
      .then(
        (resp: {
          total: number;
          transactions: Array<TransactionInterface>;
        }) => {
          this.transactions = [
            ...this.transactions,
            ...resp.transactions.map((tr) => {
              tr.description = getTransactionDescription(tr, this.accountId);
              return tr;
            })
          ];
          this.loading = false;
          if (event) {
            event.target.complete();
            if (this.transactions.length === resp.total) {
              this.scrollDisabled = true;
            }
          }
        }
      );
  }
}

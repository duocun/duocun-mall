import { Component, OnInit, OnDestroy } from "@angular/core";
import { TransactionRepInterface } from "src/app/models/transaction.model";
import { getTransactionDescription } from "src/app/models/transaction.model";
import { AuthService } from "src/app/services/auth/auth.service";
import { AccountInterface } from "src/app/models/account.model";
import { ApiService } from "src/app/services/api/api.service";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
@Component({
  selector: "app-transaction-history",
  templateUrl: "./transaction-history.page.html",
  styleUrls: ["./transaction-history.page.scss"]
})
export class TransactionHistoryPage implements OnInit, OnDestroy {
  loading: boolean;
  transactions: Array<TransactionRepInterface>;
  accountId: string;
  page: number;
  pageLength: number;
  scrollDisabled: boolean;
  backBtn = { url: "/tabs/my-account", text: "" };
  private unsubscribe$ = new Subject<void>();
  constructor(
    private authSvc: AuthService,
    private api: ApiService,
    private translator: TranslateService
  ) {
    this.loading = true;
    this.transactions = [];
    this.page = 0;
    this.pageLength = 15;
    this.scrollDisabled = false;
  }

  ngOnInit() {
    this.authSvc
      .getAccount()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((account: AccountInterface) => {
        console.log("transaction history page account subscription");
        if (account && account._id) {
          this.accountId = account._id;
          this.loadData(null);
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
        `Transactions/loadPage/${this.page}/${this.pageLength}`,
        {
          $or: [
            {
              fromId: this.accountId
            },
            {
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
          transactions: Array<TransactionRepInterface>;
        }) => {
          this.transactions = [
            ...this.transactions,
            ...resp.transactions.map((tr) => {
              tr.description = getTransactionDescription(
                tr,
                this.accountId,
                this.translator.currentLang
              );
              tr.consumed = tr.toId === this.accountId ? tr.amount : 0;
              tr.paid = tr.fromId === this.accountId ? tr.amount : 0;
              tr.balance =
                tr.fromId === this.accountId ? tr.fromBalance : tr.toBalance;
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
      )
      .catch((e) => {
        console.error(e);
        this.loading = false;
      });
  }
}

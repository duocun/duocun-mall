import { Component, OnInit, OnDestroy } from "@angular/core";
import { ApiService } from "src/app/services/api/api.service";
import { MerchantInterface } from "src/app/models/merchant.model";
import { ProductInterface, getPictureUrl } from "src/app/models/product.model";
import { ActivatedRoute, Router } from "@angular/router";
import { LocationInterface } from "src/app/models/location.model";
import { LocationService } from "src/app/services/location/location.service";
import { TranslateService } from "@ngx-translate/core";
import { AlertController } from "@ionic/angular";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
@Component({
  selector: "app-merchant",
  templateUrl: "./merchant.page.html",
  styleUrls: ["./merchant.page.scss"]
})
export class MerchantPage implements OnInit, OnDestroy {
  loading: boolean;
  merchant: MerchantInterface;
  products: Array<ProductInterface>;
  location: LocationInterface;
  private unsubscribe$ = new Subject<void>();
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private locSvc: LocationService,
    private translator: TranslateService,
    private alert: AlertController
  ) {
    this.loading = true;
  }

  ngOnInit() {
    this.locSvc.getLocation().subscribe((location) => {
      this.location = location;
    });
    this.updateData();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateData() {
    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params: { id: string }) => {
        console.log("merchant page route param subscription");
        const merchantId = params.id;
        this.api.get(`Merchants/G/${merchantId}`).then((observable) => {
          observable
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((resp: { code: string; data: MerchantInterface }) => {
              console.log("merchant page merchnat subscription");
              this.merchant = resp.data;
              this.api.get(`Products/G`, { merchantId }).then((observable) => {
                observable
                  .pipe(takeUntil(this.unsubscribe$))
                  .subscribe(
                    (resp: { code: string; data: Array<ProductInterface> }) => {
                      console.log("merchant page product subscription");
                      this.products = resp.data;
                      this.loading = false;
                    }
                  );
              });
            });
        });
      });
  }

  onProductClick(product: ProductInterface) {
    if (!this.location) {
      const header = "Notice";
      const message = "Please select delivery address";
      const button = "OK";
      this.translator
        .get([header, message, button])
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((dict) => {
          console.log("merchant page lang subscription");
          this.alert
            .create({
              header: dict[header],
              message: dict[message],
              buttons: [
                {
                  text: dict[button],
                  handler: () => {
                    this.router.navigate(["/tabs/browse"]);
                  }
                }
              ]
            })
            .then((alert) => {
              alert.present();
            });
        });
    } else {
      this.router.navigate(["/tabs/browse/products", product._id]);
    }
  }

  getPictureUrl(product: ProductInterface) {
    return getPictureUrl(product);
  }
}

import { Component, OnInit, OnDestroy } from "@angular/core";
import { ApiService } from "src/app/services/api/api.service";
import { LocationInterface } from "src/app/models/location.model";
import { MerchantInterface } from "src/app/models/merchant.model";
import { getPictureUrl } from "src/app/models/merchant.model";
import { LocationService } from "src/app/services/location/location.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
@Component({
  selector: "merchant-list",
  templateUrl: "./merchant-list.component.html",
  styleUrls: ["./merchant-list.component.scss"]
})
export class MerchantListComponent implements OnInit, OnDestroy {
  loading: boolean;
  merchants: Array<MerchantInterface>;
  location: LocationInterface;
  private unsubscribe$ = new Subject<void>();
  constructor(private locSvc: LocationService, private api: ApiService) {
    this.loading = true;
  }

  ngOnInit() {
    this.locSvc
      .getLocation()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((location: LocationInterface) => {
        console.log("merchant list location subscription");
        if (location) {
          this.api
            .get("/Areas/G/my", { lat: location.lat, lng: location.lng })
            .then((observable) => {
              observable
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((resp: { code: string; data: any }) => {
                  console.log("merchant list area subscription");
                  if (resp.code === "success") {
                    this.loadMerchants(resp.data._id);
                  }
                });
            });
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadMerchants(areaId: string) {
    this.api.get("Merchants/G", { status: "A" }).then((observable) => {
      observable.pipe(takeUntil(this.unsubscribe$)).subscribe((resp: any) => {
        console.log("merchant list page merchant subscription");
        const data = resp.data;
        const merchants: Array<any> = data;
        if (areaId) {
          this.api
            .geth("MerchantSchedules/availableMerchants", { areaId })
            .then((merchantIds: Array<string>) => {
              if (merchantIds && merchantIds.length > 0) {
                const availables = merchants.filter((merchant) =>
                  merchantIds.includes(merchant._id)
                );
                this.merchants = availables;
              } else {
                this.merchants = [];
              }
            });
        } else {
          this.merchants = merchants;
        }
        this.loading = false;
      });
    });
  }

  getPictureUrl(merchant: MerchantInterface) {
    return getPictureUrl(merchant);
  }
}

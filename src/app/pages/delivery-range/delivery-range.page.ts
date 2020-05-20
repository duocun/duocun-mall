import { Component, OnInit, OnDestroy } from "@angular/core";
import { ApiService } from "src/app/services/api/api.service";
import { AppType } from "../product/product.page";
import { LocationInterface } from "src/app/models/location.model";
import { AreaInterface } from "src/app/models/area.model";
import { LocationService } from "src/app/services/location/location.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-delivery-range",
  templateUrl: "./delivery-range.page.html",
  styleUrls: ["./delivery-range.page.scss"]
})
export class DeliveryRangePage implements OnInit, OnDestroy {
  loading: boolean;
  mapLat: number;
  mapLng: number;
  areas: Array<AreaInterface>;
  location: LocationInterface;
  private unsubscribe$ = new Subject<void>();
  constructor(private api: ApiService, private locSvc: LocationService) {
    this.loading = true;
    this.areas = [];
    this.mapLat = 43.761539;
    this.mapLng = -79.411079;
  }

  ngOnInit() {
    this.locSvc
      .getLocation()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((location) => {
        console.log("delivery range page location subscription");
        this.location = location;
        if (this.location !== undefined) {
          this.api
            .geth(
              "Areas/qFind",
              {
                appType: AppType.GROCERY,
                status: "A"
              },
              true,
              "filter"
            )
            .then((resp: Array<AreaInterface>) => {
              this.areas = resp;
              this.loading = false;
            });
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

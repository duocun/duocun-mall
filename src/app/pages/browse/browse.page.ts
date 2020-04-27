import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api/api.service";
import { TranslateService } from "@ngx-translate/core";
import { LocationInterface } from "src/app/models/location.model";
import { MerchantInterface } from "src/app/models/merchant.model";
import { getPictureUrl } from "src/app/models/merchant.model";
import { LocationService } from "src/app/services/location/location.service";
@Component({
  selector: "app-browse",
  templateUrl: "./browse.page.html",
  styleUrls: ["./browse.page.scss"]
})
export class BrowsePage implements OnInit {
  merchants: Array<MerchantInterface>;
  location: LocationInterface;
  constructor(
    private api: ApiService,
    private lang: TranslateService,
    private loc: LocationService
  ) {
    this.merchants = [];
  }

  ngOnInit() {
    this.loc.getLocation().subscribe((location: LocationInterface) => {
      if (location) {
        this.api
          .get("/Areas/G/my", { lat: location.lat, lng: location.lng })
          .then((observable) => {
            observable.subscribe((resp: { code: string; data: any }) => {
              if (resp.code === "success") {
                this.loadMerchants(resp.data._id);
              }
            });
          });
      }
    });
  }

  handleLocationSelect(event: {
    address: string;
    location: LocationInterface;
  }) {
    this.loc.setLocation(event.location);
  }

  loadMerchants(areaId: string) {
    this.api.get("Merchants/G", { status: "A" }).then((observable) => {
      observable.subscribe((resp: any) => {
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
      });
    });
  }

  getPictureUrl(merchant: MerchantInterface) {
    return getPictureUrl(merchant);
  }
}

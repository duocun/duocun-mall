import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api/api.service";
import { TranslateService } from "@ngx-translate/core";
import { LocationInterface } from "src/app/models/location.model";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-browse",
  templateUrl: "./browse.page.html",
  styleUrls: ["./browse.page.scss"]
})
export class BrowsePage implements OnInit {
  merchants: Array<any>;

  constructor(private api: ApiService, private lang: TranslateService) {
    this.merchants = [];
  }

  ngOnInit() {}

  handleLocationSelect(event: {
    address: string;
    location: LocationInterface;
  }) {
    this.api
      .get("/Areas/G/my", { lat: event.location.lat, lng: event.location.lng })
      .then((observable) => {
        observable.subscribe((resp: { code: string; data: any }) => {
          if (resp.code === "success") {
            this.loadMerchants(resp.data._id);
          }
        });
      });
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

  getPictureUrl(merchant: any) {
    if (merchant.pictures && merchant.pictures.length) {
      return environment.media + merchant.pictures[0].url;
    } else {
      return "";
    }
  }
}

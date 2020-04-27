import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { ApiService } from "src/app/services/api/api.service";
import { TranslateService } from "@ngx-translate/core";
import { PlaceInterface, formatAddress } from "src/app/models/location.model";
import { getLocationFromGeocode } from "src/app/models/location.model";

@Component({
  selector: "location-search",
  templateUrl: "./location-search.component.html",
  styleUrls: ["./location-search.component.scss"]
})
export class LocationSearchComponent implements OnInit {
  listVisible: boolean;
  searchPlaceholder: string;
  placeList: Array<PlaceInterface>;
  @Output() onSelect = new EventEmitter<{ address: string; location: any }>();

  constructor(private api: ApiService, private lang: TranslateService) {}

  ngOnInit() {
    this.placeList = [];
    this.listVisible = false;
    this.initLang();
  }

  initLang() {
    this.lang.get("Input Delivery Address").subscribe((dic: any) => {
      this.searchPlaceholder = dic;
    });
  }

  handleSearch({ detail }) {
    const key = detail.value;
    if (!key || key.length < 3) {
      return;
    }
    this.api.get(`/Locations/Places/${key}`).then((observable) => {
      observable.subscribe((data: any) => {
        this.placeList = data;
        if (this.placeList.length) {
          this.listVisible = true;
        } else {
          this.listVisible = false;
        }
      });
    });
  }

  formatAddress(place: PlaceInterface) {
    return formatAddress(place);
  }

  handleClick(place: PlaceInterface) {
    const address = this.formatAddress(place);
    if (!place.location) {
      this.api.get(`/Locations/Geocodes/${address}`).then((observable) => {
        observable.subscribe((loc: any) => {
          if (loc[0]) {
            this.onSelect.emit({
              address,
              location: getLocationFromGeocode(loc[0])
            });
          }
        });
      });
    } else {
      this.onSelect.emit({ address, location: place.location });
    }
    this.listVisible = false;
  }
}

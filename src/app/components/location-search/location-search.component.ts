import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { ApiService } from "src/app/services/api/api.service";
import { TranslateService } from "@ngx-translate/core";
import { PlaceInterface, formatAddress } from "src/app/models/location.model";
import { LocationInterface } from "src/app/models/location.model";
import { formatLocation } from "src/app/models/location.model";
import { getLocationFromGeocode } from "src/app/models/location.model";
import { AuthService } from "src/app/services/auth/auth.service";

@Component({
  selector: "location-search",
  templateUrl: "./location-search.component.html",
  styleUrls: ["./location-search.component.scss"]
})
export class LocationSearchComponent implements OnInit {
  listVisible: boolean;
  searchPlaceholder: string;
  placeList: Array<PlaceInterface>;
  locationHistory: Array<LocationInterface>;
  search: string;
  @Output() onSelect = new EventEmitter<{ address: string; location: any }>();

  constructor(
    private api: ApiService,
    private lang: TranslateService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.placeList = [];
    this.listVisible = false;
    this.auth.getAccount().subscribe((account) => {
      if (!account) {
        return;
      }
      this.api
        .geth(
          "Locations",
          {
            accountId: account._id
          },
          true,
          "filter"
        )
        .then((resp: any) => {
          this.locationHistory = resp.map((data) => {
            return data.location;
          });
        });
    });
    this.initLang();
  }

  initLang() {
    this.lang.get("Input Delivery Address").subscribe((dic: any) => {
      this.searchPlaceholder = dic;
    });
  }

  handleSearch({ detail }) {
    this.search = detail.value;
    if (!this.search || this.search.length < 3) {
      if (this.locationHistory && this.locationHistory.length) {
        this.listVisible = true;
      }
      return;
    }
    this.api.get(`/Locations/Places/${this.search}`).then((observable) => {
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

  handleFocus() {
    if (!this.search || this.search.length < 3) {
      if (this.locationHistory && this.locationHistory.length) {
        this.listVisible = true;
      }
    }
  }

  formatAddress(place: PlaceInterface) {
    return formatAddress(place);
  }

  formatLocation(location: LocationInterface) {
    return formatLocation(location);
  }

  handlePlaceClick(place: PlaceInterface) {
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

  handleLocationClick(location: LocationInterface) {
    this.onSelect.emit({
      address: this.formatLocation(location),
      location
    });
    this.listVisible = false;
  }
}

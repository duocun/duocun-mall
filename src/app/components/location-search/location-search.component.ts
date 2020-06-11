import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { ApiService } from "src/app/services/api/api.service";
import { TranslateService } from "@ngx-translate/core";
import { PlaceInterface, formatAddress } from "src/app/models/location.model";
import { LocationInterface } from "src/app/models/location.model";
import { formatLocation } from "src/app/models/location.model";
import { getLocationFromGeocode } from "src/app/models/location.model";
import { AuthService } from "src/app/services/auth/auth.service";
import { LocationService } from "src/app/services/location/location.service";
@Component({
  selector: "location-search",
  templateUrl: "./location-search.component.html",
  styleUrls: ["./location-search.component.scss"]
})
export class LocationSearchComponent implements OnInit {
  listVisible: boolean;
  placeList: Array<PlaceInterface>;
  locationHistory: Array<LocationInterface>;
  search: string;
  @Output() onSelect = new EventEmitter<{
    address: string;
    location: any;
    place?: PlaceInterface;
  }>();
  @Output() onClear = new EventEmitter<void>();
  constructor(
    private api: ApiService,
    private lang: TranslateService,
    private auth: AuthService,
    private locSvc: LocationService
  ) {}

  ngOnInit() {
    this.placeList = [];
    this.listVisible = false;
    this.locSvc.getLocation().subscribe((location: LocationInterface) => {
      if (location) {
        this.search = this.formatLocation(location);
      }
    });
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
  }

  handleSearch(event: any) {
    if (event.detail.value === this.search) {
      return;
    }
    this.search = event.detail.value;
    if (!this.search || this.search.length < 3) {
      if (this.locationHistory && this.locationHistory.length) {
        this.listVisible = true;
      }
      return;
    }
    this.api
      .get(`/Locations/Places/${event.detail.value}`)
      .then((observable) => {
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

  handleClear() {
    this.listVisible = false;
    this.placeList = [];
    this.onClear.emit();
  }

  formatAddress(place: PlaceInterface) {
    return formatAddress(place);
  }

  formatLocation(location: LocationInterface) {
    return formatLocation(location);
  }

  handlePlaceClick(place: PlaceInterface, address: string) {
    if (!place.location) {
      this.api.get(`/Locations/Geocodes/${address}`).then((observable) => {
        observable.subscribe((loc: any) => {
          if (loc[0]) {
            this.onSelect.emit({
              address,
              location: getLocationFromGeocode(loc[1] ? loc[1] : loc[0]),
              place
            });
          }
        });
      });
    } else {
      this.onSelect.emit({ address, location: place.location, place });
    }
    this.listVisible = false;
    this.search = address;
  }

  handleLocationClick(location: LocationInterface) {
    const address = this.formatLocation(location);
    this.onSelect.emit({
      address,
      location
    });
    this.listVisible = false;
    this.search = address;
  }
}

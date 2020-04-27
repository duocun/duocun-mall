import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Platform } from "@ionic/angular";
import { LocationInterface } from "src/app/models/location.model";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class LocationService {
  private location: LocationInterface;
  private location$: BehaviorSubject<LocationInterface>;
  constructor(private storage: Storage, private platform: Platform) {
    this.location = {
      lat: 43.761539,
      lng: -79.411079,
      placeId: ""
    };
    this.location$ = new BehaviorSubject<LocationInterface>(this.location);
    this.initLocation();
  }
  initLocation() {
    this.storage
      .get(environment.storageKey.location)
      .then((location: LocationInterface) => {
        this.location = location;
        if (this.location$) {
          this.location$.next(this.location);
        } else {
          this.location$ = new BehaviorSubject<LocationInterface>(
            this.location
          );
        }
      });
  }
  getLocation() {
    return this.location$;
  }
  setLocation(location: LocationInterface) {
    this.location = location;
    this.storage.set(environment.storageKey.location, this.location);
    this.location$.next(this.location);
  }
}

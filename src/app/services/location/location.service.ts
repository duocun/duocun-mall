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
  public location: LocationInterface;
  public location$: BehaviorSubject<LocationInterface>;
  constructor(private storage: Storage, private platform: Platform) {
    this.location = undefined;
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
  setLocation(location: LocationInterface, address: string, save = true) {
    this.location = location;
    this.location.address = address;
    if (save) {
      this.storage.set(environment.storageKey.location, this.location);
    } else {
      this.storage.remove(environment.storageKey.location);
    }
    this.location$.next(this.location);
  }
}

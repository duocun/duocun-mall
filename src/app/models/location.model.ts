export interface PlaceTermInterface {
  offset: number;
  value: string;
}

export interface GeoPointInterface {
  lat?: number;
  lng?: number;
  type?: string;
  coordinates?: number[];
}

export interface StructuredAddressInterface {
  main_text: string;
  secondary_text: string;
}

export interface AddressInterface {
  formattedAddress?: string;
  unit?: number;
  streetName?: string;
  streetNumber?: string;
  location?: GeoPointInterface;
  sublocality?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
  created?: Date;
  modified?: Date;
  _id?: number;
}

export interface LocationInterface {
  placeId: string;
  city?: string;
  lat: number;
  lng: number;
  postalCode?: string;
  province?: string;
  streetName?: string;
  streetNumber?: string;
  subLocality?: string;
}

export interface PlaceInterface {
  _id?: string;
  type?: string;
  description?: string;
  placeId?: string;
  structured_formatting: StructuredAddressInterface;
  terms?: PlaceTermInterface[];
  location?: LocationInterface;
}

export function formatAddress(place: PlaceInterface): string {
  let address = "";
  if (!place.structured_formatting) {
    return "";
  }
  if (place.structured_formatting.main_text) {
    address += place.structured_formatting.main_text;
  }
  if (place.structured_formatting.secondary_text) {
    address += `, ${place.structured_formatting.secondary_text}`;
  }
  return address;
}

export function formatLocation(location: LocationInterface): string {
  const addressFormats = [];
  ["streetNumber", "streetName", "subLocality", "city", "province"].forEach(
    (key) => {
      addressFormats.push(location[key] ? location[key] : "");
    }
  );
  return addressFormats.join(" ");
}

export function getLocationFromGeocode(geocodeResult): LocationInterface {
  const addr = geocodeResult && geocodeResult.address_components;
  const oLocation = geocodeResult.geometry.location;
  if (addr && addr.length) {
    const loc: LocationInterface = {
      placeId: geocodeResult.place_id,
      streetNumber: "",
      streetName: "",
      subLocality: "",
      city: "",
      province: "",
      postalCode: "",
      lat:
        typeof oLocation.lat === "function" ? oLocation.lat() : oLocation.lat,
      lng: typeof oLocation.lng === "function" ? oLocation.lng() : oLocation.lng
    };

    addr.forEach((compo) => {
      if (compo.types.indexOf("street_number") !== -1) {
        loc.streetNumber = compo.short_name;
      }
      if (compo.types.indexOf("route") !== -1) {
        loc.streetName = compo.short_name;
      }
      if (compo.types.indexOf("postal_code") !== -1) {
        loc.postalCode = compo.short_name;
      }
      if (
        compo.types.indexOf("sublocality_level_1") !== -1 &&
        compo.types.indexOf("sublocality") !== -1
      ) {
        loc.subLocality = compo.short_name;
      }
      if (compo.types.indexOf("locality") !== -1) {
        loc.city = compo.short_name;
      }
      if (compo.types.indexOf("administrative_area_level_1") !== -1) {
        loc.province = compo.short_name;
      }
    });
    return loc;
  } else {
    return null;
  }
}

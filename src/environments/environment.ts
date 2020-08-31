// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: "http://localhost:8001/v1", // "https://api.duocun.ca/v1dev", //
  storageKey: {
    auth: "DUOCUN-AUTH-TOKEN",
    cart: "DUOCUN-CART",
    location: "DUOCUN-LOCATION",
    lang: "DUOCUN-I18N"
  },
  media: "https://d27ftifr2ocsa6.cloudfront.net/media/",
  stripe: "",
  defaultLang: "en",
  gmap: "",
  timezone: "Asia/Shanghai",
  monerisMode: "prod",
  monerisHTProfileId: "",
  GOOGLE_MAP_KEY: "",
  googleAuthClientId: "",
  facebookAppId: "",
  socket: "http://localhost:8001/v1" // "https://api.duocun.ca/v1dev", //
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: "http://localhost:8000/api",
  storageKey: {
    auth: "DUOCUN-AUTH-TOKEN",
    cart: "DUOCUN-CART",
    location: "DUOCUN-LOCATION",
    lang: "DUOCUN-I18N"
  },
  media: "https://duocun.com.cn/media/",
  stripe: "pk_test_FsGoacByMF8lGNcVKveNZFSy00ATWTilJp",
  defaultLang: "zh",
  gmap: "AIzaSyCEd6D6vc9K-YzMH-QtQWRSs5HZkLKSWyk",
  timezone: "Asia/Shanghai",
  monerisMode: "prod",
  monerisHTProfileId: "ht4E3Z1H87Y3327",
  googleAuthClientId:
    "53858676843-kjkp8dt8e01tktpc8pimd3vtlvkcre81.apps.googleusercontent.com",
  alphapay: {
    partnerCode: "XB20WG",
    credentialCode: "swqqHo6TrfaWp6dPNMBncPpmjifQhxiL"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

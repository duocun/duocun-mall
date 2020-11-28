export const environment = {
  production: true,
  api: "http://localhost:8001/v1", // "https://api.duocun.ca/v1dev",
  storageKey: {
    auth: "DUOCUN-AUTH-TOKEN",
    cart: "DUOCUN-CART",
    location: "DUOCUN-LOCATION",
    lang: "DUOCUN-I18N"
  },
  media: "https://d27ftifr2ocsa6.cloudfront.net/media/",
  stripe: "",
  defaultLang: "zh",
  GOOGLE_MAP_KEY: "",
  timezone: "America/Toronto",
  monerisMode: "prod",
  monerisHTProfileId: "",
  googleAuthClientId: "",
  facebookAppId: "",
  socket: "http://localhost:8001", // "https://api.duocun.ca/v1dev", //
  svcPath: "/v1"
};

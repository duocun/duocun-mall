export const AppType = {
  FOOD_DELIVERY: "F",
  GROCERY: "G",
  FRESH: "F",
  TELECOM: "T"
};

export interface AreaInterface {
  _id: string;
  code: string;
  appType: string;
  distance?: number;
  rate?: number;
  lat?: number;
  lng?: number;
  status: string;
  coords?: Array<{
    lat: number;
    lng: number;
  }>;
}

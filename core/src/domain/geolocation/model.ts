export interface GeolocationModel {
  _type:
    | "building"
    | "road"
    | "village"
    | "neighbourhood"
    | "city"
    | "county"
    | "postcode"
    | "partial_postcode"
    | "terminated_postcode"
    | "state_district"
    | "state"
    | "region"
    | "island"
    | "body_of_water"
    | "country"
    | "continent"
    | "ficticious"
    | "unknown";
  city?: string;
  town?: string;
  village?: string;
  continent: string;
  country: string;
  country_code: string;
  state: string;
  state_code: string;
  lat: number;
  lng: number;
  latDelta: number;
  lngDelta: number;
  formatted: string;
}

export interface GeolocationModel {
  _type: string;
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

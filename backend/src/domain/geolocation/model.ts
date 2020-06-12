interface OpenCageDataGeometry {
  lat: number;
  lng: number;
}

interface OpenCageDataBounds {
  northeast: OpenCageDataGeometry;
  southwest: OpenCageDataGeometry;
}

interface OpenCageDataComponent {
  city: string;
  continent: string;
  country: string;
  country_code: string;
  state: string;
  state_code: string;
}

interface OpenCageDataResultItem {
  confidence: number;
  bounds: OpenCageDataBounds;
  components: OpenCageDataComponent;
  geometry: OpenCageDataGeometry;
}

export interface OpenCageDataResponse {
  results: OpenCageDataResultItem[];
}

export interface GeolocationJson
  extends OpenCageDataComponent,
    OpenCageDataGeometry {
  latDelta: number;
  lngDelta: number;
}

export function serializeResponse(
  response: OpenCageDataResponse
): GeolocationJson | undefined {
  const item = response.results[0];
  if (item) {
    return {
      city: item.components.city,
      continent: item.components.continent,
      country: item.components.country,
      country_code: item.components.country_code,
      state: item.components.state,
      state_code: item.components.state_code,
      lat: item.geometry.lat,
      lng: item.geometry.lng,
      latDelta: Math.abs(item.bounds.northeast.lat - item.bounds.southwest.lat),
      lngDelta: Math.abs(item.bounds.northeast.lng - item.bounds.southwest.lng),
    };
  }
}

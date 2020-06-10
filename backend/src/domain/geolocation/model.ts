interface OpenCageDataForwardComponent {
  city: string;
  continent: string;
  country: string;
  country_code: string;
  state: string;
  state_code: string;
}

interface OpenCageDataForwardGeometry {
  lat: number;
  lng: number;
}

interface OpenCageDataForwardResultItem {
  confidence: number;
  components: OpenCageDataForwardComponent;
  geometry: OpenCageDataForwardGeometry;
}

export interface OpenCageDataForwardResponse {
  results: OpenCageDataForwardResultItem[];
}

export interface GeolocationJson
  extends OpenCageDataForwardComponent,
    OpenCageDataForwardGeometry {}

export function serializeForwardResponse(
  response: OpenCageDataForwardResponse
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
    };
  }
}

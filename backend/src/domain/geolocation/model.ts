interface OpenCageDataGeometry {
  lat: number;
  lng: number;
}

interface OpenCageDataBounds {
  northeast: OpenCageDataGeometry;
  southwest: OpenCageDataGeometry;
}

interface OpenCageDataComponent {
  _type: string;
  city?: string;
  town?: string;
  village?: string;
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
  formatted: string;
}

export interface OpenCageDataResponse {
  results: OpenCageDataResultItem[];
}

export interface GeolocationJson
  extends OpenCageDataComponent,
    OpenCageDataGeometry {
  latDelta: number;
  lngDelta: number;
  formatted: string;
}

export function serializeResponse(
  response: OpenCageDataResponse
): GeolocationJson | undefined {
  const item =
    response.results.find(
      (result) =>
        !!result.components.state_code &&
        (!!result.components.city ||
          !!result.components.town ||
          !!result.components.village)
    ) ?? response.results[0];
  if (item) {
    const {
      components: {
        _type,
        town,
        village,
        city,
        continent,
        country,
        country_code,
        state,
        state_code,
      },
      geometry: { lat, lng },
      bounds: { northeast, southwest },
      formatted,
    } = item;

    return {
      _type,
      town,
      village,
      city: city ?? town ?? village,
      continent,
      country,
      country_code,
      state,
      state_code,
      lat,
      lng,
      formatted,
      latDelta: Math.abs(northeast.lat - southwest.lat),
      lngDelta: Math.abs(northeast.lng - southwest.lng),
    };
  }
}

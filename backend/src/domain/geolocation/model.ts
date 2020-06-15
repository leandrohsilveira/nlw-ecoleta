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
  suburb?: string;
  road?: string;
  house_number?: string;
  postcode?: string;
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

export interface GeolocationJson extends OpenCageDataGeometry {
  city?: string;
  suburb?: string;
  road?: string;
  house_number?: string;
  postcode?: string;
  continent: string;
  country: string;
  country_code: string;
  state: string;
  state_code: string;
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
        suburb,
        road,
        house_number,
        postcode,
      },
      geometry: { lat, lng },
      bounds: { northeast, southwest },
    } = item;
    const _city = city ?? town ?? village;
    return {
      city: _city,
      continent,
      country,
      country_code,
      state,
      state_code,
      lat,
      lng,
      suburb,
      road,
      house_number,
      postcode,
      formatted: [
        `${road ?? ""} ${house_number ?? ""}`.trim(),
        suburb,
        `${_city} - ${state_code}`,
        postcode,
      ]
        .filter((i) => !!i)
        .join(", "),
      latDelta: Math.abs(northeast.lat - southwest.lat),
      lngDelta: Math.abs(northeast.lng - southwest.lng),
    };
  }
}

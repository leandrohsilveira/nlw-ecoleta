import {
  OpenCageDataResponse,
  GeolocationJson,
  serializeResponse,
} from "./model";
import config from "../../config";
import { AxiosInstance } from "axios";

export interface GeolocationService {
  getByUfAndCity(
    uf: string,
    city: string
  ): Promise<GeolocationJson | undefined>;
  getByLatAndLng(
    lat: number,
    lng: number
  ): Promise<GeolocationJson | undefined>;
}

class GeolocationServiceImpl implements GeolocationService {
  constructor(private api: AxiosInstance) {}

  private get = async (q: string) => {
    const response = await this.api.get<OpenCageDataResponse>(
      "geocode/v1/json",
      {
        params: {
          language: "pt-br",
          no_annotations: 1,
          key: config.getOpenCageApiKey(),
          q,
        },
      }
    );
    const data = response.data;
    return serializeResponse(data);
  };

  public getByUfAndCity = async (
    uf: string,
    city: string
  ): Promise<GeolocationJson | undefined> => {
    return await this.get(`${city},${uf},Brazil`);
  };

  public getByLatAndLng = async (
    lat: number,
    lng: number
  ): Promise<GeolocationJson | undefined> => {
    return await this.get(`${lat},${lng}`);
  };
}

export default GeolocationServiceImpl;

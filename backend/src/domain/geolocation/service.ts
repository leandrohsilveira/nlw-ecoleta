import { createApi } from "./api";
import { OpenCageDataResponse, serializeResponse } from "./model";
import config from "../../config";

async function get(q: string) {
  const api = createApi();
  const response = await api.get<OpenCageDataResponse>("geocode/v1/json", {
    params: {
      key: config.getOpenCageApiKey(),
      q,
    },
  });
  const data = response.data;
  return serializeResponse(data);
}

async function getByUfAndCity(uf: string, city: string) {
  return await get(`${city},${uf},Brazil`);
}

async function getByLatAndLng(lat: number, lng: number) {
  return await get(`${lat},${lng}`);
}

const geolocationService = {
  getByUfAndCity,
  getByLatAndLng,
};

export default geolocationService;

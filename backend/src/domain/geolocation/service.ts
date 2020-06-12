import { createApi } from "./api";
import { OpenCageDataResponse, serializeResponse } from "./model";
import config from "../../config";

async function getByUfAndCity(uf: string, city: string) {
  const api = createApi();
  const response = await api.get<OpenCageDataResponse>("geocode/v1/json", {
    params: {
      key: config.getOpenCageApiKey(),
      q: `${city},${uf},Brazil`,
    },
  });
  const data = response.data;
  return serializeResponse(data);
}

const geolocationService = {
  getByUfAndCity,
};

export default geolocationService;

import { createApi } from "./api";
import { OpenCageDataForwardResponse, serializeForwardResponse } from "./model";
import config from "../../config";

async function getByUfAndCity(uf: string, city: string) {
  const api = createApi();
  const response = await api.get<OpenCageDataForwardResponse>(
    "geocode/v1/json",
    {
      params: {
        key: config.getOpenCageApiKey(),
        q: `${city},${uf},Brazil`,
      },
    }
  );
  const data = response.data;
  return serializeForwardResponse(data);
}

const geolocationService = {
  getByUfAndCity,
};

export default geolocationService;

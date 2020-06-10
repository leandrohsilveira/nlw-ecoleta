import createApi from "../../util/api";
import { GeolocationModel } from "./model";

async function getByUfAndCity(uf: string, city: string) {
  const api = createApi();
  const response = await api.get<GeolocationModel>("/geolocation", {
    params: {
      uf,
      city,
    },
  });
  return response.data;
}

const geolocationService = {
  getByUfAndCity,
};

export default geolocationService;

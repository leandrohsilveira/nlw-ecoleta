import { createApi } from "./api";
import GeolocationServiceImpl from "./service";
import GeolocationController from "./controller";

const api = createApi();
export const geolocationService = new GeolocationServiceImpl(api);
export const geolocationController = new GeolocationController(
  geolocationService
);

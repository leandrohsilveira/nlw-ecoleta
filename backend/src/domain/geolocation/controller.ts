import { Request, Response } from "express";
import requestUtil from "../../util/request-util";
import { GeolocationService } from "./service";
import { serializePersistenceResult } from "../model";
import { GeolocationJson } from "./model";

class GeolocationController {
  constructor(private geolocationService: GeolocationService) {}

  private get = async (
    request: Request,
    response: Response,
    factory: () => Promise<GeolocationJson | undefined>
  ) => {
    try {
      const item = await factory();
      if (item) {
        response.json(item);
      } else {
        response.status(404).json(
          serializePersistenceResult(false, {
            message: "Geolocation data not found",
          })
        );
      }
    } catch (error) {
      console.error(error);
      response
        .status(500)
        .send(serializePersistenceResult(false, { message: error.message }));
    }
  };

  getByUfAndCity = async (request: Request, response: Response) => {
    this.get(request, response, () => {
      const uf = requestUtil.queryAsArray(request, "uf", String)[0];
      const city = requestUtil.queryAsArray(request, "city", String)[0];
      return this.geolocationService.getByUfAndCity(uf, city);
    });
  };

  getByLatAndLng = async (request: Request, response: Response) => {
    this.get(request, response, () => {
      const lat = requestUtil.queryAsArray(request, "lat", Number)[0];
      const lng = requestUtil.queryAsArray(request, "lng", Number)[0];
      return this.geolocationService.getByLatAndLng(lat, lng);
    });
  };
}

export default GeolocationController;

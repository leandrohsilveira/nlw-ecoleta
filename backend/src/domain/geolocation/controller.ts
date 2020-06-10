import { Request, Response } from "express";
import requestUtil from "../../util/request-util";
import geolocationService from "./service";
import { serializePersistenceResult } from "../model";

class GeolocationController {
  getByUfAndCity = async (request: Request, response: Response) => {
    try {
      const uf = requestUtil.queryAsArray(request, "uf", String)[0];
      const city = requestUtil.queryAsArray(request, "city", String)[0];
      const item = await geolocationService.getByUfAndCity(uf, city);
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
}

export default GeolocationController;

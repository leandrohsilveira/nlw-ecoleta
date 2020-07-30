import { createApi } from "./api";
import GeolocationServiceImpl, { GeolocationService } from "./service";
import GeolocationController from "./controller";
import { RouterModule } from "../..";
import { Router } from "express";
import { OpenCageApiConfiguration } from "../../config";

class GeolocationModule implements RouterModule {
  constructor(public route: string, config: OpenCageApiConfiguration) {
    this.geolocationService = new GeolocationServiceImpl(
      createApi(config),
      config
    );
    this.geolocationController = new GeolocationController(
      this.geolocationService
    );
  }

  public geolocationService: GeolocationService;

  private geolocationController: GeolocationController;

  createRequestHandler = () => {
    const geolocationRouter = Router();
    geolocationRouter.get("/", this.geolocationController.getByUfAndCity);
    geolocationRouter.get(
      "/reverse",
      this.geolocationController.getByLatAndLng
    );
    return geolocationRouter;
  };
}

export default GeolocationModule;

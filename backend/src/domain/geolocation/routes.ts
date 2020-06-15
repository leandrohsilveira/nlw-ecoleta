import { Router } from "express";
import { geolocationController } from ".";

const geolocationRouter = Router();

geolocationRouter.get("/", geolocationController.getByUfAndCity);
geolocationRouter.get("/reverse", geolocationController.getByLatAndLng);

export default geolocationRouter;

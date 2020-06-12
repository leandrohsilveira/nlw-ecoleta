import { Router } from "express";
import GeolocationController from "./controller";

const geolocationRouter = Router();
const controller = new GeolocationController();

geolocationRouter.get("/", controller.getByUfAndCity);
geolocationRouter.get("/reverse", controller.getByLatAndLng);

export default geolocationRouter;

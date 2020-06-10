import { Router } from "express";
import GeolocationController from "./controller";

const geolocationRouter = Router();
const controller = new GeolocationController();

geolocationRouter.get("/", controller.getByUfAndCity);

export default geolocationRouter;

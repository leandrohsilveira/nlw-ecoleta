import { Router } from "express";
import PointController from "./controller";

const pointRouter = Router();

const controller = new PointController();

pointRouter.post("/", controller.create);

export default pointRouter;

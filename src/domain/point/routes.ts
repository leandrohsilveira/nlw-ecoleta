import { Router } from "express";
import PointController from "./controller";

const pointRouter = Router();

const controller = new PointController();

pointRouter.get("/", controller.findAll);
pointRouter.get("/:id", controller.findById);
pointRouter.post("/", controller.create);

export default pointRouter;

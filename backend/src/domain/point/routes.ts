import { Router } from "express";
import { pointController } from ".";

const pointRouter = Router();

pointRouter.get("/", pointController.findAll);
pointRouter.get("/:id", pointController.findById);
pointRouter.post("/", pointController.create);

export default pointRouter;

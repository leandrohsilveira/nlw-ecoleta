import { Router } from "express";
import { itemController } from ".";

const itemRouter = Router();
itemRouter.get("/", itemController.findAll);

export default itemRouter;

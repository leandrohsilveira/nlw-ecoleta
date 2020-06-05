import { Router } from "express";
import ItemController from "./controller";

const itemRouter = Router();

const itemController = new ItemController();

itemRouter.get("/", itemController.findAll);

export default itemRouter;

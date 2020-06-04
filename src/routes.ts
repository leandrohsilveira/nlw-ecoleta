import express from "express";
import itemRouter from "./domain/item/routes";
import pointRouter from "./domain/point/routes";

const routes = express.Router();

routes.use("/items", itemRouter);
routes.use("/points", pointRouter);

export default routes;

import express from "express";
import path from "path";
import itemRouter from "./domain/item/routes";
import pointRouter from "./domain/point/routes";
import geolocationRouter from "./domain/geolocation/routes";

const routes = express.Router();

routes.use(
  "/uploads",
  express.static(path.resolve(__dirname, "..", "uploads"))
);
routes.use("/items", itemRouter);
routes.use("/points", pointRouter);
routes.use("/geolocation", geolocationRouter);

export default routes;

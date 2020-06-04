import express from "express";
import itemRouter from "./domain/item/routes";

const routes = express.Router();

routes.use("/items", itemRouter);

export default routes;

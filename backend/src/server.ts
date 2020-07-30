import express from "express";
import cors from "cors";
import knex from "knex";
import path from "path";
import ServerModule, {
  createModuleFromMiddleware,
  createSimpleRouterModule,
} from ".";
import config from "./config";
import PointItemModule from "./domain/point-item";
import { databaseConnectionConfig } from "./database/config";
import ItemModule from "./domain/item";
import PointModule from "./domain/point";
import GeolocationModule from "./domain/geolocation";

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

const connection = knex(databaseConnectionConfig);

const connectionFactory = () => connection;

const pointItemModule = new PointItemModule(connectionFactory);

const geolocationModule = new GeolocationModule("/geolocation", config);
const itemModule = new ItemModule("/items", connectionFactory);
const pointModule = new PointModule(
  "/points",
  connectionFactory,
  pointItemModule,
  itemModule
);

const server = new ServerModule(
  config,
  createModuleFromMiddleware(() => cors()),
  createModuleFromMiddleware(() => express.json()),
  createSimpleRouterModule("/uploads", () =>
    express.static(path.resolve(__dirname, "..", "uploads"))
  ),
  itemModule,
  pointModule,
  geolocationModule
);

server.start();

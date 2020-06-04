import express from "express";
import path from "path";
import routes from "./routes";
import config from "./config";

const app = express();

app.use(express.json());

app.use(routes);

app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

app.listen(config.getPort(), () => console.log("Server started"));

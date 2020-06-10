import express from "express";
import routes from "./routes";
import config from "./config";
import cors from "cors";

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(config.getPort(), () => console.log("Server started"));

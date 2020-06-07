import express from "express";
import routes from "./routes";
import config from "./config";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(config.getPort(), () => console.log("Server started"));

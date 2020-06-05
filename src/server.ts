import express from "express";
import routes from "./routes";
import config from "./config";

const app = express();

app.use(express.json());
app.use(routes);

app.listen(config.getPort(), () => console.log("Server started"));

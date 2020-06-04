import { Request } from "express";
import config from "../config";

const requestUtil = {
  getServerBaseUrl: (request: Request): string =>
    `${request.protocol}://${request.hostname}:${config.getPort()}`,
};

export default requestUtil;

import { Request } from "express";
import config from "../config";

interface QueryStringParamParser<T> {
  (value: string): T;
}

function getServerBaseUrl(request: Request): string {
  return `${request.protocol}://${request.hostname}:${config.getPort()}`;
}

function queryAsArray<T>(
  request: Request,
  paramName: string,
  parser: QueryStringParamParser<T>
): T[] {
  const value = request.query[paramName];
  if (value) {
    if (Array.isArray(value)) return (value as string[]).map(parser);
    else return [parser(value as string)];
  }
  return [];
}

const requestUtil = {
  getServerBaseUrl,
  queryAsArray,
};

export default requestUtil;

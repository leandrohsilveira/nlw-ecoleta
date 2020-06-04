import { Request } from "express";
import createAbstractModel, {
  AbstractModel,
  AbstractJson,
  serializeAbstractJson,
} from "../model";
import { Item, serializeItem, ItemJson } from "../item/model";
import requestUtil from "../../util/request-util";

export interface Point extends AbstractModel {
  image: string;
  name: string;
  email: string;
  whatsapp: string;
  latitude: number;
  longitude: number;
  city: string;
  uf: string;
}

export interface PointJson extends AbstractJson {
  image_url: string;
  name: string;
  email: string;
  whatsapp: string;
  latitude: number;
  longitude: number;
  city: string;
  uf: string;
  items?: ItemJson[];
}

export function serializePoint(
  request: Request,
  point: Point,
  items?: Item[]
): PointJson {
  return serializeAbstractJson(point, (json) => ({
    ...json,
    image_url: `${requestUtil.getServerBaseUrl(request)}/uploads/${
      point.image
    }`,
    name: point.name,
    email: point.email,
    whatsapp: point.whatsapp,
    latitude: point.latitude,
    longitude: point.longitude,
    city: point.city,
    uf: point.uf,
    items: items?.map((item) => serializeItem(request, item)),
  }));
}

export function createPoint(
  image: string,
  name: string,
  email: string,
  whatsapp: string,
  latitude: number,
  longitude: number,
  city: string,
  uf: string
): Point {
  return createAbstractModel((model) => ({
    ...model,
    image,
    email,
    name,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
  }));
}

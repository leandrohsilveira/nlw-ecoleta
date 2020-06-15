import { Request } from "express";
import createAbstractModel, {
  AbstractModel,
  serializeAbstractJson,
  AbstractJson,
} from "../model";
import requestUtil from "../../util/request-util";

export interface Item extends AbstractModel {
  title: string;
  image: string;
}

export interface ItemJson extends AbstractJson {
  title: string;
  image_url: string;
}

export function serializeItem(request: Request, item: Item): ItemJson {
  return serializeAbstractJson(item, (json) => ({
    ...json,
    title: item.title,
    image_url: `${requestUtil.getServerBaseUrl(request)}/uploads/${item.image}`,
  }));
}

export default function createItem(title: string, image: string): Item {
  return createAbstractModel((model) => ({
    ...model,
    title,
    image,
  }));
}

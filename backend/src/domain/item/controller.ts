import { Request, Response } from "express";

import { ItemService } from "./service";
import { Item, ItemJson, serializeItem } from "./model";

export interface ItemSerializer {
  (request: Request, item: Item): ItemJson;
}

export default class ItemController {
  constructor(private itemService: ItemService) {}

  public findAll = async (request: Request, response: Response) => {
    const items: Item[] = await this.itemService.findAll();
    return response.json(items.map((item) => serializeItem(request, item)));
  };
}

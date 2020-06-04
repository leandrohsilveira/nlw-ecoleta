import { Request, Response } from "express";

import itemService from "./service";
import { Item, serializeItem } from "./model";

export default class ItemController {
  async findAll(request: Request, response: Response) {
    const items: Item[] = await itemService.findAll();

    return response.json(items.map((item) => serializeItem(request, item)));
  }
}

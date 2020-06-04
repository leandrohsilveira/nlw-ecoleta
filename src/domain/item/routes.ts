import { Router } from "express";
import itemService from "./service";
import { Item, serializeItem } from "./model";

const itemRouter = Router();

itemRouter.get("/", async (request, response) => {
  const items: Item[] = await itemService.findAll();

  return response.json(items.map((item) => serializeItem(request, item)));
});

export default itemRouter;

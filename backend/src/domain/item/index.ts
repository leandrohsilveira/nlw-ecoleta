import ItemServiceImpl from "./service";
import ItemController from "./controller";

export const itemService = new ItemServiceImpl();

export const itemController = new ItemController(itemService);

import ItemServiceImpl, { ItemService } from "./service";
import {
  ConnectionFactory,
  createTableConnectionFactory,
} from "../../database";
import { RouterModule } from "../..";
import { Router } from "express";
import ItemController from "./controller";

class ItemModule implements RouterModule {
  constructor(public route: string, connectionFactory: ConnectionFactory) {
    this.itemService = new ItemServiceImpl(
      createTableConnectionFactory(connectionFactory, "item")
    );
    this.itemController = new ItemController(this.itemService);
  }

  public itemService: ItemService;

  private itemController: ItemController;

  createRequestHandler = () => {
    const router = Router();
    router.get("/", this.itemController.findAll);
    return router;
  };
}

export default ItemModule;

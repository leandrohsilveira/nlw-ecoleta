import PointServiceImpl, { PointService } from "./service";
import PointController from "./controller";
import ItemModule from "../item";
import PointItemModule from "../point-item";
import {
  createTransactionFactory,
  createTableConnectionFactory,
  ConnectionFactory,
} from "../../database";
import { RouterModule } from "../..";
import { Router } from "express";

class PointModule implements RouterModule {
  constructor(
    public route: string,
    connectionFactory: ConnectionFactory,
    { pointItemService }: PointItemModule,
    { itemService }: ItemModule
  ) {
    this.pointService = new PointServiceImpl(
      pointItemService,
      createTableConnectionFactory(connectionFactory, "point")
    );
    this.pointController = new PointController(
      this.pointService,
      itemService,
      createTransactionFactory(connectionFactory)
    );
  }

  public pointService: PointService;

  private pointController: PointController;

  createRequestHandler = () => {
    const router = Router();
    router.get("/", this.pointController.findAll);
    router.get("/:id", this.pointController.findById);
    router.post("/", this.pointController.create);
    return router;
  };
}

export default PointModule;

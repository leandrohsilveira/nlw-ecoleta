import PointItemServiceImpl, { PointItemService } from "./service";
import {
  ConnectionFactory,
  createTableConnectionFactory,
} from "../../database";

class PointItemModule {
  constructor(connectionFactory: ConnectionFactory) {
    this.pointItemService = new PointItemServiceImpl(
      createTableConnectionFactory(connectionFactory, "point_item")
    );
  }

  public pointItemService: PointItemService;
}

export default PointItemModule;

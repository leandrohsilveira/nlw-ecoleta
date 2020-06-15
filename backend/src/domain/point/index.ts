import PointServiceImpl from "./service";
import PointController from "./controller";
import { itemService } from "../item";
import { pointItemService } from "../point-item";

export const pointService = new PointServiceImpl(pointItemService);

export const pointController = new PointController(pointService, itemService);

import createAbstractModel, { AbstractModel } from "../model";

export interface PointItem extends AbstractModel {
  point_id: number;
  item_id: number;
}

export default function createPointItem(point_id: number, item_id: number) {
  return createAbstractModel((model) => ({
    ...model,
    point_id,
    item_id,
  }));
}

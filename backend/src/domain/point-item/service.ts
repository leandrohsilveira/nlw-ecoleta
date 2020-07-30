import { Transaction } from "knex";
import createPointItem, { PointItem } from "./model";
import { TableConnectionFactory } from "../../database";

export interface PointItemService {
  create(pointItems: PointItem[], trx?: Transaction): Promise<number[]>;

  createForPoint(
    point_id: number,
    itemsIds: number[],
    trx?: Transaction
  ): Promise<number[]>;

  findAllByPointId(point_id: number, trx?: Transaction): Promise<PointItem[]>;
}

class PointItemServiceImpl implements PointItemService {
  constructor(private connectionFactory: TableConnectionFactory) {}

  public create = async (
    pointItems: PointItem[],
    trx?: Transaction
  ): Promise<number[]> => {
    return await this.connectionFactory(trx).insert(pointItems);
  };

  public createForPoint = async (
    point_id: number,
    itemsIds: number[],
    trx?: Transaction
  ): Promise<number[]> => {
    const pointItems = itemsIds.map((item_id) =>
      createPointItem(point_id, item_id)
    );
    return await this.create(pointItems, trx);
  };

  public findAllByPointId = async (
    point_id: number,
    trx?: Transaction
  ): Promise<PointItem[]> => {
    return await this.connectionFactory(trx).select("*").where({ point_id });
  };
}

export default PointItemServiceImpl;

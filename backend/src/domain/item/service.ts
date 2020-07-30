import { Transaction } from "knex";
import { Item } from "./model";
import { TableConnectionFactory } from "../../database";

export interface ItemService {
  findAll(trx?: Transaction): Promise<Item[]>;
  findAllByPointItemPointId(
    point_id: number,
    trx?: Transaction
  ): Promise<Item[]>;
}

class ItemServiceImpl implements ItemService {
  constructor(private connectionFactory: TableConnectionFactory) {}

  findAll = async (trx?: Transaction): Promise<Item[]> => {
    return await this.connectionFactory(trx).select("*");
  };

  findAllByPointItemPointId = async (
    point_id: number,
    trx?: Transaction
  ): Promise<Item[]> => {
    return await this.connectionFactory(trx)
      .join("point_item", "item.id", "=", "point_item.item_id")
      .where("point_item.point_id", point_id)
      .distinct()
      .select("item.*");
  };
}

export default ItemServiceImpl;

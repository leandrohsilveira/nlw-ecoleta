import databaseConnection from "../../database/connection";
import { Item } from "./model";
import { Transaction } from "knex";

function itemConnection(trx?: Transaction) {
  return (trx ?? databaseConnection)("item");
}

async function findAll(trx?: Transaction): Promise<Item[]> {
  return itemConnection(trx).select("*");
}

async function findAllByPointItemPointId(
  point_id: number,
  trx?: Transaction
): Promise<Item[]> {
  return itemConnection(trx)
    .join("point_item", "item.id", "=", "point_item.item_id")
    .where("point_item.point_id", point_id)
    .distinct()
    .select("item.*");
}

const itemService = {
  findAll,
  findAllByPointItemPointId,
};

export default itemService;

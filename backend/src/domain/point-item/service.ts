import createPointItem, { PointItem } from "./model";
import databaseConnection from "../../database/connection";
import Knex, { Transaction } from "knex";

function pointItemConnection(trx?: Transaction) {
  return (trx ?? databaseConnection)("point_item");
}

async function create(
  pointItems: PointItem[],
  trx?: Transaction
): Promise<number[]> {
  return await pointItemConnection(trx).insert(pointItems);
}

async function createForPoint(
  point_id: number,
  itemsIds: number[],
  trx?: Transaction
): Promise<number[]> {
  const pointItems = itemsIds.map((item_id) =>
    createPointItem(point_id, item_id)
  );
  return await create(pointItems, trx);
}

async function findAllByPointId(
  point_id: number,
  trx?: Transaction
): Promise<PointItem[]> {
  return await pointItemConnection(trx).select("*").where({ point_id });
}

const pointItemService = {
  create,
  createForPoint,
  findAllByPointId,
};

export default pointItemService;

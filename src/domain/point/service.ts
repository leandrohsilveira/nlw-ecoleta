import databaseConnection from "../../database/connection";
import { Point } from "./model";
import pointItemService from "../point-item/service";
import { Transaction } from "knex";

function pointConnection(trx?: Transaction) {
  return (trx ?? databaseConnection)("point");
}

async function create(
  point: Point,
  items: number[],
  trx?: Transaction
): Promise<number> {
  const [point_id] = await pointConnection(trx).insert(point);

  await pointItemService.createForPoint(point_id, items, trx);

  return point_id;
}

async function findAll(trx?: Transaction): Promise<Point[]> {
  return await pointConnection(trx).select("*");
}

async function findById(id: number, trx?: Transaction): Promise<Point> {
  const [point] = await pointConnection(trx).select("*").where({ id });
  return point;
}

const pointService = {
  create,
  findAll,
  findById,
};

export default pointService;

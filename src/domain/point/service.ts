import databaseConnection from "../../database/connection";
import { Point } from "./model";
import pointItemService from "../point-item/service";
import { Transaction } from "knex";
import { FetchModelListResult } from "../model";
import queryUtil from "../../util/query-util";

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

async function findAll(
  trx?: Transaction
): Promise<FetchModelListResult<Point>> {
  const items = await pointConnection(trx).select("*");
  const count = await queryUtil.count(pointConnection(trx));

  return { items, count };
}

async function findById(id: number, trx?: Transaction): Promise<Point> {
  return await pointConnection(trx).select("*").where({ id }).first();
}

const pointService = {
  create,
  findAll,
  findById,
};

export default pointService;

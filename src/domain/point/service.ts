import databaseConnection from "../../database/connection";
import { Point } from "./model";
import pointItemService from "../point-item/service";
import Knex, { Transaction } from "knex";
import { FetchModelListResult } from "../model";
import queryUtil from "../../util/query-util";

interface PointFilters {
  items?: number[];
  ufs?: string[];
  cities?: string[];
}

const DEFAULT_FILTERS: PointFilters = {
  items: [],
  ufs: [],
  cities: [],
};

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
  { items, cities, ufs }: PointFilters = DEFAULT_FILTERS,
  trx?: Transaction
): Promise<FetchModelListResult<Point>> {
  function applyFilters(query: Knex.QueryBuilder) {
    if (items?.length)
      query
        .join("point_item", "point.id", "=", "point_item.point_id")
        .whereIn("point_item.item_id", items);
    if (cities?.length) query = query.whereIn("point.city", cities);
    if (ufs?.length) query = query.whereIn("point.uf", ufs);
    return query;
  }

  const points = await applyFilters(pointConnection(trx))
    .distinct()
    .select("point.*");
  const count = await queryUtil.count(
    applyFilters(pointConnection(trx)),
    "point.id",
    true
  );
  return { items: points, count };
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

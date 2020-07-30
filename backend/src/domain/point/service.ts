import Knex, { Transaction } from "knex";
import { Point } from "./model";
import { FetchModelListResult } from "../model";
import queryUtil from "../../util/query-util";
import { PointItemService } from "../point-item/service";
import { TableConnectionFactory } from "../../database";

interface PointFilters {
  items?: number[];
  ufs?: string[];
  cities?: string[];
}

export interface PointService {
  create(point: Point, items: number[], trx?: Transaction): Promise<number>;
  findAll(
    filters?: PointFilters,
    trx?: Transaction
  ): Promise<FetchModelListResult<Point>>;
  findById(id: number, trx?: Transaction): Promise<Point>;
}

const DEFAULT_FILTERS: PointFilters = {
  items: [],
  ufs: [],
  cities: [],
};

class PointServiceImpl implements PointService {
  constructor(
    private pointItemService: PointItemService,
    private connectionFactory: TableConnectionFactory
  ) {}

  private applyFilters = (
    query: Knex.QueryBuilder,
    { items, cities, ufs }: PointFilters
  ) => {
    if (items?.length)
      query
        .join("point_item", "point.id", "=", "point_item.point_id")
        .whereIn("point_item.item_id", items);
    if (cities?.length) query = query.whereIn("point.city", cities);
    if (ufs?.length) query = query.whereIn("point.uf", ufs);
    return query;
  };

  public create = async (
    point: Point,
    items: number[],
    trx?: Transaction
  ): Promise<number> => {
    const [point_id] = await this.connectionFactory(trx).insert(point);

    await this.pointItemService.createForPoint(point_id, items, trx);

    return point_id;
  };

  public findAll = async (
    filters: PointFilters = DEFAULT_FILTERS,
    trx?: Transaction
  ): Promise<FetchModelListResult<Point>> => {
    const points = await this.applyFilters(this.connectionFactory(trx), filters)
      .distinct()
      .select("point.*");

    const count = await queryUtil.count(
      this.applyFilters(this.connectionFactory(trx), filters),
      "point.id",
      true
    );
    return { items: points, count };
  };

  public findById = async (id: number, trx?: Transaction): Promise<Point> => {
    return await this.connectionFactory(trx).select("*").where({ id }).first();
  };
}

export default PointServiceImpl;

import { Request, Response } from "express";
import pointService from "./service";
import { createPoint, serializePoint, PointJson } from "./model";
import databaseConnection from "../../database/connection";
import pointItemService from "../point-item/service";
import itemService from "../item/service";
import { serializePersistenceResult } from "../model";
import { Transaction } from "knex";

export default class PointController {
  public async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const trx = await databaseConnection.transaction();
    try {
      const id = await pointService.create(
        createPoint(
          "image-fake",
          name,
          email,
          whatsapp,
          Number(latitude),
          Number(longitude),
          city,
          uf
        ),
        items as number[],
        trx
      );

      const point = await this._findById(request, id, trx);

      response.json(serializePersistenceResult(true, point));

      trx.commit();
    } catch (error) {
      trx.rollback();
      response.json(serializePersistenceResult(false, error));
    }
  }

  public async findById(request: Request, response: Response) {
    const { id } = request.params;
    const point = await this._findById(request, Number(id));
    response.json(point);
  }

  private async _findById(
    request: Request,
    id: number,
    trx?: Transaction
  ): Promise<PointJson> {
    const point = await pointService.findById(id, trx);

    const itemsIds = (await pointItemService.findAllByPointId(id, trx)).map(
      (pointItem) => pointItem.item_id
    );

    const relItems = await itemService.findAllByIdIn(itemsIds, trx);

    return serializePoint(request, point, relItems);
  }
}

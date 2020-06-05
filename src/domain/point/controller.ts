import { Request, Response } from "express";
import pointService from "./service";
import { createPoint, serializePoint, PointJson } from "./model";
import databaseConnection from "../../database/connection";
import pointItemService from "../point-item/service";
import itemService from "../item/service";
import {
  serializePersistenceResult as serializeResult,
  serializeFetchListResult,
} from "../model";
import { Transaction } from "knex";

export default class PointController {
  public findAll = async (request: Request, response: Response) => {
    try {
      const points = await pointService.findAll();
      response.json(
        serializeFetchListResult(points, (point) =>
          serializePoint(request, point)
        )
      );
    } catch (error) {
      console.error(error);
      response.json(serializeResult(false, error));
    }
  };

  public create = async (request: Request, response: Response) => {
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
      if (point) {
        response.json(serializeResult(true, point));
        trx.commit();
      } else {
        console.error(
          `Transaction rollback: Something gone wrong because the created point with id ${id} was not found`
        );
        response.status(500).json(
          serializeResult(false, {
            message: `Something gone wrong because the created point with id ${id} was not found`,
          })
        );
        trx.rollback();
      }
    } catch (error) {
      console.error("Transaction rollback", error);
      trx.rollback();
      response.json(serializeResult(false, error));
    }
  };

  public findById = async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const point = await this._findById(request, Number(id));
      if (point) response.json(serializeResult(true, point));
      else
        response
          .status(404)
          .json(serializeResult(false, { message: "Point not found" }));
    } catch (error) {
      console.error(error);
      response.json(serializeResult(false, error));
    }
  };

  private _findById = async (
    request: Request,
    id: number,
    trx?: Transaction
  ): Promise<PointJson | null> => {
    const point = await pointService.findById(id, trx);
    if (point) {
      const itemsIds = (await pointItemService.findAllByPointId(id, trx)).map(
        (pointItem) => pointItem.item_id
      );

      const relItems = await itemService.findAllByIdIn(itemsIds, trx);

      return serializePoint(request, point, relItems);
    }
    return null;
  };
}

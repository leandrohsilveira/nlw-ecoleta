import databaseConnection from "../../database/connection";
import { Item } from "./model";
import { Transaction } from "knex";

function itemConnection(trx?: Transaction) {
  return (trx ?? databaseConnection)("item");
}

async function findAll(trx?: Transaction): Promise<Item[]> {
  return itemConnection(trx).select("*");
}

async function findAllByIdIn(
  ids: number[],
  trx?: Transaction
): Promise<Item[]> {
  return itemConnection(trx).select("*").whereIn("id", ids);
}

const itemService = {
  findAll,
  findAllByIdIn,
};

export default itemService;

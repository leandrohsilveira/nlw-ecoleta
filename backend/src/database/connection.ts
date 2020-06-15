import Knex from "knex";
import knex, { Transaction } from "knex";
import path from "path";

export interface ConnectionFactory {
  (trx?: Transaction): Knex.QueryBuilder;
}

export const databaseConnectionConfig: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: path.resolve(__dirname, "database.sqlite"),
  },
  useNullAsDefault: true,
};

export const adminDatabaseConnectionConfig: Knex.Config = {
  ...databaseConnectionConfig,
  migrations: {
    directory: path.resolve(__dirname, "migrations"),
  },
  seeds: {
    directory: path.resolve(__dirname, "seeds"),
  },
};

function createDatabaseConnection(): Knex {
  return knex(databaseConnectionConfig);
}

const databaseConnection = createDatabaseConnection();

export default databaseConnection;

import Knex from "knex";

import path from "path";

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

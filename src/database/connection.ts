import knex from "knex";
import path from "path";
import Knex from "knex";

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
};

function createDatabaseConnection(): Knex {
  return knex(databaseConnectionConfig);
}

const databaseConnection = createDatabaseConnection();

export default databaseConnection;

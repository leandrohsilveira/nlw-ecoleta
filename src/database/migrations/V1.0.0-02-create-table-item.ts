import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("item", (table) => {
    table.uuid("uuid").primary();
    table.timestamp("createdDate").notNullable();
    table.timestamp("lastUpdatedDate").notNullable();
    table.string("image").notNullable();
    table.string("title").notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("item");
}

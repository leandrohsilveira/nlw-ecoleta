import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("point", (table) => {
    table.uuid("uuid").primary();
    table.timestamp("createdDate").notNullable();
    table.timestamp("lastUpdatedDate").notNullable();
    table.string("image").notNullable();
    table.string("name").notNullable();
    table.string("whatsapp").notNullable();
    table.float("latitude").notNullable();
    table.float("longitude").notNullable();
    table.string("city").notNullable();
    table.string("uf", 2).notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("point");
}

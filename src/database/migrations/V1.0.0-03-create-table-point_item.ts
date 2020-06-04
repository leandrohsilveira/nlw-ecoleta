import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("point_item", (table) => {
    table.uuid("uuid").primary();
    table.timestamp("createdDate").notNullable();
    table.timestamp("lastUpdatedDate").notNullable();
    table.uuid("point_uuid").notNullable();
    table.uuid("item_uuid").notNullable();
    table
      .foreign("point_uuid", "fk_point_item_point")
      .references("uuid")
      .inTable("point");
    table
      .foreign("item_uuid", "fk_point_item_item")
      .references("uuid")
      .inTable("item");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("point_item");
}

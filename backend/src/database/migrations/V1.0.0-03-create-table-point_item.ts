import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("point_item", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("point_id").notNullable();
    table.bigInteger("item_id").notNullable();
    table.timestamps();
    table
      .foreign("point_id", "fk_point_item_point")
      .references("id")
      .inTable("point");
    table
      .foreign("item_id", "fk_point_item_item")
      .references("id")
      .inTable("item");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("point_item");
}

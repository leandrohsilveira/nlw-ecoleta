import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("item", (table) => {
    table.bigIncrements("id").primary();
    table.string("image").notNullable();
    table.string("title").notNullable();
    table.timestamps();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("item");
}

import Knex from "knex";
import createItem, { Item } from "../../domain/item/model";

export async function seed(knex: Knex) {
  const now = new Date();
  const items: Item[] = [
    createItem("Lâmpadas", "lampadas.svg"),
    createItem("Pilhas e baterias", "baterias.svg"),
    createItem("Papéis e Papelão", "papeis-papelao.svg"),
    createItem("Resíduos Eletrônicos", "eletronicos.svg"),
    createItem("Resíduos Orgânicos", "organicos.svg"),
    createItem("Óleo de Cozinha", "oleo.svg"),
  ];

  await knex("item").insert(items);
}

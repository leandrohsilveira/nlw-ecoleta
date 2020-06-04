import databaseConnection from "../../database/connection";

async function findAll() {
  return databaseConnection("item").select("*");
}

const itemService = {
  findAll,
};

export default itemService;

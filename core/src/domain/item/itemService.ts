import createApi from "../../util/api";
import { Item } from "./model";

async function findAll() {
  const api = createApi();
  const response = await api.get<Item[]>("/items");
  return response.data;
}

const itemService = {
  findAll,
};

export default itemService;

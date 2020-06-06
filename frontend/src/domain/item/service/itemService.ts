import createApi from "../../../util/api";
import { Item } from "../model";

async function findAll() {
  const api = createApi();
  const response = await api.get("/items");
  return response.data as Item[];
}

const itemService = {
  findAll,
};

export default itemService;

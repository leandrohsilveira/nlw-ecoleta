import createApi from "../../../util/api";
import { Point } from "../model";

async function create(point: Point) {
  const api = createApi();
  const response = await api.post("/points", point);
  console.log(response.data);
}

const pointService = {
  create,
};

export default pointService;

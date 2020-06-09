import createApi from "../../util/api";
import { Point, PointModel } from "./model";
import { ResultList } from "../model";

async function create(point: Point) {
  const api = createApi();
  const response = await api.post("/points", point);
  console.log(response.data);
}

async function findAllByUfAndCityAndItensIn(
  uf: string,
  city: string,
  items: number[]
) {
  const api = createApi();
  const response = await api.get<ResultList<PointModel>>("/points", {
    params: {
      uf: uf,
      city: city,
      items: items,
    },
  });
  return response.data;
}

const pointService = {
  create,
  findAllByUfAndCityAndItensIn,
};

export default pointService;

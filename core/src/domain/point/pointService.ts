import createApi from "../../util/api";
import { Point, PointModel, PointDetailModel } from "./model";
import { ResultList, Result } from "../model";

async function create(point: Point) {
  const api = createApi();
  const response = await api.post("/points", point);
  console.log(response.data);
}

async function findById(id: number) {
  const api = createApi();
  const response = await api.get<Result<PointDetailModel>>(`/points/${id}`);
  return response.data;
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
  findById,
  findAllByUfAndCityAndItensIn,
};

export default pointService;

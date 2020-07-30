import axios from "axios";
import { OpenCageApiConfiguration } from "../../config";

export function createApi(config: OpenCageApiConfiguration) {
  return axios.create({
    baseURL: config.getOpenCageApiUrl(),
  });
}

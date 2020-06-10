import axios from "axios";
import config from "../../config";

export function createApi() {
  return axios.create({
    baseURL: config.getOpenCageApiUrl(),
  });
}

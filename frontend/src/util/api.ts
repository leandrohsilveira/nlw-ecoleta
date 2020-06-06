import axios from "axios";
import config from "../config";
import { useState, useEffect, useCallback } from "react";

interface RequestFactory<T> {
  (): Promise<T>;
}

function createApi() {
  return axios.create({
    baseURL: config.getBackendBaseUrl(),
  });
}

export function createIbgeApi(version = "v1") {
  return axios.create({
    baseURL: `https://servicodados.ibge.gov.br/api/${version}`,
  });
}
    async function doFetch() {
      setState(await request());
    }
    doFetch();
  }, [setState, request]);

  useEffect(() => {
    fetch();
  }, [fetch]);
  return state;
}

export default createApi;

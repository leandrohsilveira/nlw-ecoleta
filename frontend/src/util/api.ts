import axios from "axios";
import config from "../config";
import { useCallback, useState } from "react";

interface RequestFactory<T, Z extends Array<any>> {
  (...args: Z): Promise<T>;
}

interface Consumer<T> {
  (value: T): void;
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

export function useApiCallback<T, Z extends Array<any>>(
  requestFactory: RequestFactory<T, Z>,
  setter: Consumer<T>,
  initialLoadingState = false
): [(...args: Z) => void, boolean] {
  const [loading, setLoading] = useState(initialLoadingState);
  return [
    useCallback(
      (...args) => {
        async function doFetch() {
          setLoading(true);
          const result = await requestFactory(...args);
          setter(result);
          setLoading(false);
        }
        doFetch();
      },
      [requestFactory, setter]
    ),
    loading,
  ];
}

export default createApi;

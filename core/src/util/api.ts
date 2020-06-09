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

/**
 *
 * @param requestFactory The request factory. Must return a promise (or be an async function)
 * @param setter The setter function where the promise result will be set
 * @param initialLoadingState The initial loading state, defaults to false
 *
 * @returns An array which: [fetchFunction, loadingsState, cancelFunction]
 */
export function useApiCallback<T, Z extends Array<any>>(
  requestFactory: RequestFactory<T, Z>,
  setter: Consumer<T>,
  initialLoadingState = false
): [(...args: Z) => void, boolean, () => void] {
  const [cancelled, setCancelled] = useState(false);
  const [loading, setLoading] = useState(initialLoadingState);

  return [
    useCallback(
      (...args: Z) => {
        async function doFetch() {
          setLoading(true);
          const result = await requestFactory(...args);
          if (!cancelled) {
            setter(result);
            setLoading(false);
          }
        }
        doFetch();
      },
      [requestFactory, setter]
    ),
    loading,
    useCallback(() => {
      setCancelled(true);
    }, []),
  ];
}

export default createApi;

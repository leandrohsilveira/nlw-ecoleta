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

export function useStateFromApi<T>(
  request: RequestFactory<T>,
  initialState: T
) {
  const [state, setState] = useState<T>(initialState);
  const fetch = useCallback(() => {
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

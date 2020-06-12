import { useEffect, EffectCallback, useMemo } from "react";

export function useDidMountEffect(callback: EffectCallback) {
  useEffect(callback, []);
}

export function useFinalMemo<T>(factory: () => T) {
  return useMemo<T>(factory, []);
}

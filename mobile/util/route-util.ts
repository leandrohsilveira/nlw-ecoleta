import { useRoute } from "@react-navigation/native";

export function useRouteParams<T>(defaultValues?: T): T {
  const route = useRoute();
  return {
    ...(defaultValues ?? {}),
    ...(((route.params ?? {}) as unknown) as T),
  };
}

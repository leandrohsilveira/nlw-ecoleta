import { CorsOptions } from "cors";

interface ServerConfiguration {
  getPort(): number;
  getCors(): CorsOptions;
}

interface ValueParser<T> {
  (value: string): T;
}

interface DefaultValueSupplier<T> {
  (): T;
}

function asString(value: string) {
  return value;
}

function splitByCommaParser<T>(parser: ValueParser<T>): ValueParser<T[]> {
  return (value) => value.split(",").map(parser);
}

function getEnvAsArray<T>(
  name: string,
  parser: ValueParser<T>,
  defaultValue?: DefaultValueSupplier<T[]>
): T[] {
  return getEnv(name, splitByCommaParser(parser), defaultValue);
}

function getEnv<T>(
  name: string,
  parser: ValueParser<T>,
  defaultValue?: DefaultValueSupplier<T> | T
): T {
  const value = process.env[name];
  if (value) {
    return parser(value);
  } else if (typeof defaultValue === "function") {
    return (defaultValue as DefaultValueSupplier<T>)();
  } else if (defaultValue) {
    return defaultValue as T;
  } else {
    throw new Error(`Unset required configuration "${name}"`);
  }
}

function getPort(): number {
  return getEnv("SERVER_PORT", Number, 3333);
}

function getCors(): CorsOptions {
  return {
    allowedHeaders: [
      ...getEnvAsArray("CORS_ALLOWED_HEADERS", asString, () => []),
    ],
    methods: getEnvAsArray("CORS_ALLOWED_METHODS", asString, () => [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ]),
    origin: getEnv(
      "CORS_ALLOWED_ORIGIN_REGEX",
      RegExp,
      () => /localhost(\:\d{2,5})?$/
    ),
  };
}

const config: ServerConfiguration = {
  getPort,
  getCors,
};

export default config;
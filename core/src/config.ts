interface Config {
  backendBaseUrl: string;
}

let config: Config;

function getConfig(): Config {
  if (!config)
    throw new Error(
      "Core module configurations not set, applyConfigurations should be called before any configuration read"
    );
  return config;
}

function getBackendBaseUrl() {
  return getConfig().backendBaseUrl;
}

export function applyConfigurations(cfg: Config) {
  config = cfg;
}

export default {
  getBackendBaseUrl,
};

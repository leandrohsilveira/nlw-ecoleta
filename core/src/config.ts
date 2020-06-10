export interface EcoletaCoreConfig {
  backendBaseUrl: string;
}

let config: EcoletaCoreConfig;

function getConfig(): EcoletaCoreConfig {
  if (!config)
    throw new Error(
      "Core module configurations not set, applyConfigurations should be called before any configuration read"
    );
  return config;
}

function getBackendBaseUrl() {
  return getConfig().backendBaseUrl;
}

export function applyConfigurations(cfg: EcoletaCoreConfig) {
  config = cfg;
}

export default {
  getBackendBaseUrl,
};

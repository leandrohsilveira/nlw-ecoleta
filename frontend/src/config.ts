import { EcoletaCoreConfig } from "ecoleta-core";

function getBackendBaseUrl() {
  return process.env.BACKEND_BASE_URL ?? "http://localhost:3333";
}

const config: EcoletaCoreConfig = {
  backendBaseUrl: getBackendBaseUrl(),
};

export default config;

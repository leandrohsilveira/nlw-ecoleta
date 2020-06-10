import { EcoletaCoreConfig } from "ecoleta-core";

function getBackendBaseUrl() {
  return "http://192.168.1.100:3333";
}

const config: EcoletaCoreConfig = {
  backendBaseUrl: getBackendBaseUrl(),
};

export default config;

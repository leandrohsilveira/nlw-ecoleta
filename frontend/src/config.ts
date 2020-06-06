function getBackendBaseUrl() {
  return process.env.BACKEND_BASE_URL ?? "http://localhost:3333";
}

const config = {
  getBackendBaseUrl,
};

export default config;

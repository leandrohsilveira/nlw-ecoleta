interface ServerConfiguration {
  getPort(): number;
}

const config: ServerConfiguration = {
  getPort: () => Number(process.env.SERVER_PORT ?? 3333),
};

export default config;

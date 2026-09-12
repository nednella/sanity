type Config = {
  host: string;
  port: number;
  logLevel: string;
};

export const config: Config = {
  host: process.env.HOST ?? "localhost",
  port: Number(process.env.PORT ?? 3000),
  logLevel: process.env.LOG_LEVEL ?? "info"
};

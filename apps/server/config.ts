type Config = {
  host: string;
  port: number;
  databaseUrl: string;
  corsOrigin: string;
  logLevel: string;
  womGroupId: string;
  womApiKey: string;
  womUserAgent: string;
};

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`missing environment variable: ${name}`);
  return value;
};

export const config: Config = {
  host: required("HOST"),
  port: Number(required("PORT")),
  databaseUrl: required("DATABASE_URL"),
  corsOrigin: required("CORS_ORIGIN"),
  logLevel: required("LOG_LEVEL"),
  womGroupId: required("WOM_GROUP_ID"),
  womApiKey: required("WOM_API_KEY"),
  womUserAgent: required("WOM_USER_AGENT")
};

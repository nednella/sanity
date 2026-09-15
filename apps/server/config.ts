type Config = {
  host: string;
  port: number;
  logLevel: string;
  databaseUrl: string;
  womGroupId: string;
  corsOrigin: string;
};

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`missing environment variable: ${name}`);
  return value;
};

export const config: Config = {
  host: required("HOST"),
  port: Number(required("PORT")),
  logLevel: required("LOG_LEVEL"),
  databaseUrl: required("DATABASE_URL"),
  womGroupId: required("WOM_GROUP_ID"),
  corsOrigin: required("CORS_ORIGIN")
};

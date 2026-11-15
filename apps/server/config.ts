type Config = {
  corsOrigin: string;
  databaseUrl: string;
  host: string;
  isProduction: boolean;
  logLevel: string;
  port: number;
  trustProxy: false | string;
  womApiKey: string;
  womGroupId: string;
  womUserAgent: string;
};

export const config: Config = {
  host: required("HOST"),
  port: Number(required("PORT")),
  databaseUrl: required("DATABASE_URL"),
  corsOrigin: required("CORS_ORIGIN"),
  logLevel: required("LOG_LEVEL"),
  isProduction: process.env.NODE_ENV === "production",
  trustProxy: process.env.TRUST_PROXY || false,
  womGroupId: required("WOM_GROUP_ID"),
  womApiKey: required("WOM_API_KEY"),
  womUserAgent: required("WOM_USER_AGENT")
};

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`missing environment variable: ${name}`);
  return value;
}

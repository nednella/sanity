import { defineConfig } from "drizzle-kit";

import { config } from "./config.js";

const { databaseUrl } = config;

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: { url: databaseUrl }
});

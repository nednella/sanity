import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { config } from "../config.js";
import * as schema from "./schema.js";

const { databaseUrl } = config;

export const db = drizzle({
  client: postgres(databaseUrl),
  schema,
  casing: "snake_case"
});

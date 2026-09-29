import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { config } from "@config";

import * as schema from "./schema";

export const client = postgres(config.databaseUrl);

export const db = drizzle({
  client,
  schema,
  casing: "snake_case"
});

type Database = typeof db;

// A repository write takes either the client or an open transaction, so a service can compose
// several of them into one.
export type Queryable = Database | Parameters<Parameters<Database["transaction"]>[0]>[0];

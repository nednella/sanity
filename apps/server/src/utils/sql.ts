import { type SQLWrapper, sql } from "drizzle-orm";

export function epochSeconds(interval: SQLWrapper) {
  return sql<number>`extract(epoch from ${interval})::float8`;
}

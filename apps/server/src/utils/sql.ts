import { type SQLWrapper, asc, desc, sql } from "drizzle-orm";

export function epochSeconds(interval: SQLWrapper) {
  return sql<number>`extract(epoch from ${interval})::float8`;
}

export function sortBy(column: SQLWrapper, order: "asc" | "desc") {
  return order === "asc" ? asc(column) : desc(column);
}

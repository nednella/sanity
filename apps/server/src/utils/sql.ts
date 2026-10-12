import { type SQLWrapper, sql } from "drizzle-orm";

export const epochSeconds = (interval: SQLWrapper) => sql<number>`extract(epoch from ${interval})::float8`;

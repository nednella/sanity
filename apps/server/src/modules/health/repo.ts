import { db } from "@db/index";
import { sql } from "drizzle-orm";

export const pingDatabase = async () => {
  await db.execute(sql`select 1`);
};

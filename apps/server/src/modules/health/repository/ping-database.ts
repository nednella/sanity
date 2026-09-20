import { sql } from "drizzle-orm";

import { db } from "@db/index";

export const pingDatabase = async () => {
  await db.execute(sql`select 1`);
};

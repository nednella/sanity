import { sql } from "drizzle-orm";

import { db } from "../../../db/index.js";

export const pingDatabase = async () => {
  await db.execute(sql`select 1`);
};

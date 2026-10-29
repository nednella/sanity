import { sql } from "drizzle-orm";

import { db } from "@db/index";

export async function pingDatabase() {
  await db.execute(sql`select 1`);
}

import { asc } from "drizzle-orm";

import { db } from "@db/index";
import { bosses } from "@db/schema";

export function listBosses() {
  return db.select().from(bosses).orderBy(asc(bosses.name));
}

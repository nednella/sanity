import { sql } from "drizzle-orm";

import { db } from "@db/index";
import { bosses } from "@db/schema";

export type BossRow = typeof bosses.$inferInsert;

export const saveBosses = async (rows: BossRow[]) => {
  if (rows.length === 0) return 0;

  const saved = await db
    .insert(bosses)
    .values(rows)
    .onConflictDoUpdate({
      target: bosses.womMetric,
      set: { name: sql`excluded.name`, womKillsPerHour: sql`excluded.wom_kills_per_hour` }
    })
    .returning({ id: bosses.id });

  return saved.length;
};

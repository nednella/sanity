import { sql } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { bosses } from "@db/schema";

export type BossRow = typeof bosses.$inferInsert;

export async function saveBosses(tx: Transaction, rows: BossRow[]) {
  const saved = await tx
    .insert(bosses)
    .values(rows)
    .onConflictDoUpdate({
      target: bosses.womMetric,
      set: { name: sql`excluded.name`, womKillsPerHour: sql`excluded.wom_kills_per_hour` }
    })
    .returning({ id: bosses.id });

  return saved.length;
}

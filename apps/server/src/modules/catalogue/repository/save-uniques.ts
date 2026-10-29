import { sql } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { bossUniques } from "@db/schema";

export type UniqueRow = typeof bossUniques.$inferInsert;

export async function saveUniques(tx: Transaction, rows: UniqueRow[]) {
  const saved = await tx
    .insert(bossUniques)
    .values(rows)
    .onConflictDoUpdate({
      target: [bossUniques.bossId, bossUniques.itemId],
      set: { dropRate: sql`excluded.drop_rate` }
    })
    .returning({ bossId: bossUniques.bossId });

  return saved.length;
}

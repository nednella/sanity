import { sql } from "drizzle-orm";

import { db } from "@db/index";
import { bossUniques } from "@db/schema";

export type UniqueRow = typeof bossUniques.$inferInsert;

export const saveUniques = async (rows: UniqueRow[]) => {
  if (rows.length === 0) return 0;

  const saved = await db
    .insert(bossUniques)
    .values(rows)
    .onConflictDoUpdate({
      target: [bossUniques.bossId, bossUniques.itemId],
      set: { dropRate: sql`excluded.drop_rate` }
    })
    .returning({ bossId: bossUniques.bossId });

  return saved.length;
};

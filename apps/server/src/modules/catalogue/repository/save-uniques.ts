import { sql } from "drizzle-orm";

import { db } from "@db/index";
import { bossUniques } from "@db/schema";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";

export type UniqueRow = typeof bossUniques.$inferInsert;

export const saveUniques = async (rows: UniqueRow[]) => {
  if (rows.length === 0) return 0;

  return db.transaction(async (tx) => {
    const saved = await tx
      .insert(bossUniques)
      .values(rows)
      .onConflictDoUpdate({
        target: [bossUniques.bossId, bossUniques.itemId],
        set: { dropRate: sql`excluded.drop_rate` }
      })
      .returning({ bossId: bossUniques.bossId });

    await recordAuditEntry(tx, {
      action: "catalogue_changed",
      note: `${saved.length} uniques saved`,
      source: "server"
    });

    return saved.length;
  });
};

import { sql } from "drizzle-orm";

import { db } from "@db/index";
import { bosses } from "@db/schema";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";

export type BossRow = typeof bosses.$inferInsert;

export const saveBosses = async (rows: BossRow[]) => {
  if (rows.length === 0) return 0;

  return db.transaction(async (tx) => {
    const saved = await tx
      .insert(bosses)
      .values(rows)
      .onConflictDoUpdate({
        target: bosses.womMetric,
        set: { name: sql`excluded.name`, womKillsPerHour: sql`excluded.wom_kills_per_hour` }
      })
      .returning({ id: bosses.id });

    await recordAuditEntry(tx, {
      action: "catalogue_changed",
      note: `${saved.length} bosses saved`,
      source: "server"
    });

    return saved.length;
  });
};

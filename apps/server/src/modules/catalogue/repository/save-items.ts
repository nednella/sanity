import { sql } from "drizzle-orm";

import { db } from "@db/index";
import { items } from "@db/schema";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";

export type ItemRow = typeof items.$inferInsert;

export const saveItems = async (rows: ItemRow[]) => {
  const seen = new Set<string>();
  const unique = rows.filter((row) => {
    const name = row.name.toLowerCase();
    if (seen.has(name)) return false;

    seen.add(name);
    return true;
  });

  if (unique.length === 0) return 0;

  return db.transaction(async (tx) => {
    const saved = await tx
      .insert(items)
      .values(unique)
      .onConflictDoUpdate({
        target: items.name,
        set: { name: sql`excluded.name`, osrsItemId: sql`coalesce(excluded.osrs_item_id, ${items.osrsItemId})` }
      })
      .returning({ id: items.id });

    await recordAuditEntry(tx, {
      action: "catalogue_changed",
      note: `${saved.length} items saved`,
      source: "server"
    });

    return saved.length;
  });
};

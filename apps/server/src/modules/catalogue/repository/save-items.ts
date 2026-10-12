import { sql } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { items } from "@db/schema";

export type ItemRow = typeof items.$inferInsert;

export const saveItems = async (tx: Transaction, rows: ItemRow[]) => {
  const seen = new Set<string>();
  const unique = rows.filter((row) => {
    const name = row.name.toLowerCase();
    if (seen.has(name)) return false;

    seen.add(name);
    return true;
  });

  const saved = await tx
    .insert(items)
    .values(unique)
    .onConflictDoUpdate({
      target: items.name,
      set: { name: sql`excluded.name`, osrsItemId: sql`coalesce(excluded.osrs_item_id, ${items.osrsItemId})` }
    })
    .returning({ id: items.id });

  return saved.length;
};

import { sql } from "drizzle-orm";

import { db } from "@db/index";
import { items } from "@db/schema";

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

  const saved = await db
    .insert(items)
    .values(unique)
    .onConflictDoUpdate({
      target: items.name,
      set: { name: sql`excluded.name`, osrsItemId: sql`coalesce(excluded.osrs_item_id, ${items.osrsItemId})` }
    })
    .returning({ id: items.id });

  return saved.length;
};

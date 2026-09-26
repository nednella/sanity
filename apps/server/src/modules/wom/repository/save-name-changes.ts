import { db } from "@db/index";
import { womNameChanges } from "@db/schema";

export type NameChangeRow = typeof womNameChanges.$inferInsert;

export const saveNameChanges = async (rows: NameChangeRow[]) => {
  if (rows.length === 0) return 0;

  const saved = await db
    .insert(womNameChanges)
    .values(rows)
    .onConflictDoNothing({ target: womNameChanges.id })
    .returning({ id: womNameChanges.id });

  return saved.length;
};

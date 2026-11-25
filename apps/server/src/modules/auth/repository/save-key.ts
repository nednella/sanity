import { db } from "@db/index";
import { authKeys } from "@db/schema";

/**
 * Saves a new key and returns its ID. Ensure the caller NEVER passes the key
 * itself, only the hashed key.
 */
export async function saveKey(key: typeof authKeys.$inferInsert) {
  const [saved] = await db.insert(authKeys).values(key).returning({ id: authKeys.id });
  return saved!.id;
}

import { db } from "@db/index";
import { apiKeys } from "@db/schema";

/**
 * Saves a new key and returns its ID. Ensure the caller NEVER passes the key
 * itself, only the hashed key.
 */
export async function saveApiKey(key: typeof apiKeys.$inferInsert) {
  const [saved] = await db.insert(apiKeys).values(key).returning({ id: apiKeys.id });
  return saved!.id;
}

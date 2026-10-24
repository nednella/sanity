import { and, eq, isNull } from "drizzle-orm";

import { db } from "@db/index";
import { apiKeys } from "@db/schema";

/**
 * Revokes a key, so that it no longer authenticates. The row stays.
 *
 * Returns `false` when no key has this ID, or the key is already revoked.
 */
export async function revokeApiKey(id: number) {
  const [revoked] = await db
    .update(apiKeys)
    .set({ revokedAt: new Date() })
    .where(and(eq(apiKeys.id, id), isNull(apiKeys.revokedAt)))
    .returning({ id: apiKeys.id });

  return revoked !== undefined;
}

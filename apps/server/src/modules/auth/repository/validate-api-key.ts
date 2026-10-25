import { and, eq, isNull } from "drizzle-orm";

import { db } from "@db/index";
import { apiKeys } from "@db/schema";

/**
 * Finds the live key with the given hash and stamps its `last_used_at`.
 *
 * Returns `undefined` when no key is found, or the key is revoked.
 */
export async function validateApiKey(keyHash: string) {
  const [key] = await db
    .update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(and(eq(apiKeys.keyHash, keyHash), isNull(apiKeys.revokedAt)))
    .returning({ client: apiKeys.client, memberId: apiKeys.memberId });

  return key;
}

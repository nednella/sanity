import { and, eq, isNull } from "drizzle-orm";

import { db } from "@db/index";
import { authKeys } from "@db/schema";

/**
 * Finds the live key with the given hash and stamps its `last_used_at`.
 *
 * Returns the key's associated client and member ID, else `undefined` when no
 * key is found, or the key is revoked.
 */
export async function validateKey(keyHash: string) {
  const [key] = await db
    .update(authKeys)
    .set({ lastUsedAt: new Date() })
    .where(and(eq(authKeys.keyHash, keyHash), isNull(authKeys.revokedAt)))
    .returning({ client: authKeys.client, memberId: authKeys.memberId });

  return key;
}

import { and, eq, isNull } from "drizzle-orm";

import { db } from "@db/index";
import { authKeys } from "@db/schema";

/**
 * Revokes a key, so that it no longer authenticates. The row stays.
 *
 * Returns `false` when no key has this ID, or the key is already revoked.
 */
export async function revokeKey(id: number) {
  const [revoked] = await db
    .update(authKeys)
    .set({ revokedAt: new Date() })
    .where(and(eq(authKeys.id, id), isNull(authKeys.revokedAt)))
    .returning({ id: authKeys.id });

  return revoked !== undefined;
}

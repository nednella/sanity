import { asc } from "drizzle-orm";

import { db } from "@db/index";
import { authKeys } from "@db/schema";

/**
 * Lists every API key, oldest first, WITHOUT hash.
 */
export function listKeys() {
  return db
    .select({
      id: authKeys.id,
      client: authKeys.client,
      memberId: authKeys.memberId,
      createdAt: authKeys.createdAt,
      lastUsedAt: authKeys.lastUsedAt,
      revokedAt: authKeys.revokedAt
    })
    .from(authKeys)
    .orderBy(asc(authKeys.id));
}

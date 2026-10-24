import { asc } from "drizzle-orm";

import { db } from "@db/index";
import { apiKeys } from "@db/schema";

/**
 * Lists every API key, oldest first, WITHOUT hash.
 */
export function listApiKeys() {
  return db
    .select({
      id: apiKeys.id,
      client: apiKeys.client,
      memberId: apiKeys.memberId,
      createdAt: apiKeys.createdAt,
      lastUsedAt: apiKeys.lastUsedAt,
      revokedAt: apiKeys.revokedAt
    })
    .from(apiKeys)
    .orderBy(asc(apiKeys.id));
}

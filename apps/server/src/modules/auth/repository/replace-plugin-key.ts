import { and, eq, isNull } from "drizzle-orm";

import { db } from "@db/index";
import { apiKeys, members } from "@db/schema";

/**
 * Revokes the member's live plugin key, if any, and saves the new
 * one. Ensure the caller NEVER passes the key itself, only the hashed key.
 *
 * The transaction first locks the member row. The second request waits on
 * that lock until the first commits, then revokes the first request's key.
 *
 * Throws when no member has this ID: the foreign key rejects the insert and
 * the transaction rolls back. The caller has already found the member during
 * authentication, so this is unlikely to ever happen!
 */
export function replacePluginKey(memberId: bigint, keyHash: string) {
  return db.transaction(async (tx) => {
    await tx.select({ id: members.id }).from(members).where(eq(members.id, memberId)).for("update");

    await tx
      .update(apiKeys)
      .set({ revokedAt: new Date() })
      .where(and(eq(apiKeys.client, "plugin"), eq(apiKeys.memberId, memberId), isNull(apiKeys.revokedAt)));

    await tx.insert(apiKeys).values({
      client: "plugin",
      keyHash,
      memberId
    });
  });
}

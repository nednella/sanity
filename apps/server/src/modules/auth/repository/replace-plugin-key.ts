import { eq } from "drizzle-orm";

import { db } from "@db/index";
import { apiKeys, members } from "@db/schema";

import { revokePluginKeys } from "./revoke-plugin-keys";

/**
 * Revokes the member's live plugin key, if any, and saves the new
 * one. Ensure the caller NEVER passes the key itself, only the hashed key.
 *
 * The transaction first locks the member row. The second request waits on
 * that lock until the first commits, then revokes the first request's key.
 * Revoking access waits on the same lock, so it also revokes a key saved just before.
 *
 * Returns `false`, and saves nothing, when the member's plugin access is revoked.
 *
 * Throws when no member has this ID: the foreign key rejects the insert and
 * the transaction rolls back. The caller has already found the member during
 * authentication, so this is unlikely to ever happen!
 */
export function replacePluginKey(memberId: bigint, keyHash: string) {
  return db.transaction(async (tx) => {
    const [member] = await tx
      .select({ pluginAccessRevokedAt: members.pluginAccessRevokedAt })
      .from(members)
      .where(eq(members.id, memberId))
      .for("update");
    if (member?.pluginAccessRevokedAt) return false;

    await revokePluginKeys(tx, [memberId]);
    await tx.insert(apiKeys).values({
      client: "plugin",
      keyHash,
      memberId
    });

    return true;
  });
}

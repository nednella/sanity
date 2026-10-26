import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import type { Auth } from "@/modules/auth/hooks/authenticate";
import { revokePluginKey } from "@/modules/auth/repository/revoke-plugin-key";

import { setPluginAccessRevokedAt } from "../repository/set-plugin-access-revoked-at";
import type { PluginAccessChange } from "../request";
import { executePerTaggedMember } from "./shared/execute-per-tagged-member";

/**
 * Revokes or reinstates members' plugin access. A revoke also revokes the
 * member's live plugin key. After a reinstate, the member gets a new key with
 * /plugin-key.
 */
export async function changePluginAccess({ note, revoked, taggedDiscordIds }: PluginAccessChange, auth: Auth) {
  return executePerTaggedMember({ taggedDiscordIds }, async (tx, member) => {
    if (revoked && member.pluginAccessRevokedAt !== null) return { outcome: "already-plugin-access-revoked" as const };
    if (!revoked && member.pluginAccessRevokedAt === null) return { outcome: "has-plugin-access" as const };

    await setPluginAccessRevokedAt(tx, member.id, revoked ? new Date() : null);
    if (revoked) await revokePluginKey(tx, member.id);
    await recordAuditEntry(tx, {
      actingMemberId: auth.member.id,
      action: "plugin_access_changed",
      affects: [member.id],
      note: note ?? (revoked ? "plugin access revoked" : "plugin access reinstated"),
      source: auth.client
    });

    return { outcome: revoked ? ("plugin-access-revoked" as const) : ("plugin-access-reinstated" as const) };
  });
}

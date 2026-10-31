import { db } from "@db/index";

import type { ApplicationError } from "@/errors/error";
import { recordAuditEntries } from "@/modules/audit/repository/record-audit-entries";
import type { Auth } from "@/modules/auth/hooks/authenticate";
import { revokePluginKeys } from "@/modules/auth/repository/revoke-plugin-keys";

import { memberErrors } from "../errors";
import { listMemberIdsByRef } from "../repository/list-member-ids-by-ref";
import { listMembersById } from "../repository/list-members-by-id";
import { setPluginAccessRevokedAt } from "../repository/set-plugin-access-revoked-at";
import type { PluginAccessChange } from "../request";

type Member = Awaited<ReturnType<typeof listMembersById>>[number];

/**
 * Revokes or reinstates members' plugin access. A revoke also revokes the
 * member's live plugin key. After a reinstate, the member gets a new key with
 * /plugin-key.
 */
export async function changePluginAccess({ members, note, revoked }: PluginAccessChange, auth: Auth) {
  return db.transaction(async (tx) => {
    const memberIds = await listMemberIdsByRef(tx, members);
    const found = await listMembersById(tx, memberIds);

    const changed: { member: Member }[] = [];
    const skipped: { member: Member; error: ApplicationError }[] = [];

    for (const member of found) {
      const isRevoked = member.pluginAccessRevokedAt !== null;

      if (revoked && isRevoked) skipped.push({ member, error: memberErrors.pluginAccessRevoked() });
      else if (!revoked && !isRevoked) skipped.push({ member, error: memberErrors.hasPluginAccess() });
      else changed.push({ member });
    }

    const changedIds = changed.map(({ member }) => member.id);

    await setPluginAccessRevokedAt(tx, changedIds, revoked ? new Date() : null);
    if (revoked) await revokePluginKeys(tx, changedIds);
    await recordAuditEntries(
      tx,
      auth,
      "plugin_access_changed",
      changed,
      () => note ?? (revoked ? "plugin access revoked" : "plugin access reinstated")
    );

    return { changed, skipped };
  });
}

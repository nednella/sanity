import { db } from "@db/index";

import type { ApplicationError } from "@/errors/error";
import { recordAuditEntries } from "@/modules/audit/repository/record-audit-entries";
import type { ActingAuth } from "@/modules/auth/hooks/authenticate";
import { revokePluginKeys } from "@/modules/auth/repository/revoke-plugin-keys";
import { memberErrors } from "@/modules/members/errors";
import { listMemberIdsByRef } from "@/modules/members/repository/list-member-ids-by-ref";
import { listMembersById } from "@/modules/members/repository/list-members-by-id";
import { setPluginAccessRevokedAt } from "@/modules/members/repository/set-plugin-access-revoked-at";
import type { PluginAccessChange } from "@/modules/members/request";

/**
 * Revokes or reinstates members' plugin access. A revoke also revokes the
 * member's live plugin key. After a reinstate, the member gets a new key with
 * /plugin-key.
 */
export async function changePluginAccess({ members, note, revoked }: PluginAccessChange, auth: ActingAuth) {
  return db.transaction(async (tx) => {
    const memberIds = await listMemberIdsByRef(tx, members);
    const found = await listMembersById(tx, memberIds);
    const { changed, skipped } = splitByPluginAccess(found, revoked);

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

type Member = Awaited<ReturnType<typeof listMembersById>>[number];

function splitByPluginAccess(found: Member[], revoked: boolean) {
  const changed: { member: Member }[] = [];
  const skipped: { error: ApplicationError; member: Member }[] = [];

  for (const member of found) {
    const isRevoked = member.pluginAccessRevokedAt !== null;

    if (revoked && isRevoked) skipped.push({ member, error: memberErrors.pluginAccessRevoked() });
    else if (!revoked && !isRevoked) skipped.push({ member, error: memberErrors.hasPluginAccess() });
    else changed.push({ member });
  }

  return { changed, skipped };
}

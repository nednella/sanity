import { db } from "@db/index";

import type { ApplicationError } from "@/errors/error";
import { recordAuditEntries } from "@/modules/audit/repository/record-audit-entries";
import type { Auth } from "@/modules/auth/hooks/authenticate";
import { isRoleAbove } from "@/modules/auth/hooks/authorise";
import { QUIT_RANK_ID } from "@/modules/ranks/constants";

import { memberErrors } from "../errors";
import { listMemberIdsByRef } from "../repository/list-member-ids-by-ref";
import { listMembersById } from "../repository/list-members-by-id";
import { setMemberRoles } from "../repository/set-member-roles";
import type { RoleChange } from "../request";

type Member = Awaited<ReturnType<typeof listMembersById>>[number];

/**
 * Gives a role, or removes any role when role is null. The caller can change
 * only members they outrank, so that no admin can demote another.
 */
export async function changeMemberRoles({ members, note, role }: RoleChange, auth: Auth) {
  return db.transaction(async (tx) => {
    const memberIds = await listMemberIdsByRef(tx, members);
    const found = await listMembersById(tx, memberIds);

    const changed: { member: Member }[] = [];
    const skipped: { member: Member; error: ApplicationError }[] = [];

    for (const member of found) {
      if (!isRoleAbove(auth.member.role, member.role)) skipped.push({ member, error: memberErrors.roleTooHigh() });
      else if (role === null && member.role === null) skipped.push({ member, error: memberErrors.hasNoRole() });
      else if (role !== null && member.role === role)
        skipped.push({ member, error: memberErrors.alreadyHasRole(role) });
      else if (role !== null && member.rankId === QUIT_RANK_ID) skipped.push({ member, error: memberErrors.hasQuit() });
      else changed.push({ member });
    }

    await setMemberRoles(
      tx,
      changed.map(({ member }) => member.id),
      role
    );
    await recordAuditEntries(
      tx,
      auth,
      "role_changed",
      changed,
      ({ member }) => note ?? `${member.role ?? "member"} to ${role ?? "member"}`
    );

    return { changed, skipped };
  });
}

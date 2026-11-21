import { db } from "@db/index";

import type { ApplicationError } from "@/errors/error";
import { recordAuditEntries } from "@/modules/audit/repository/record-audit-entries";
import type { ActingAuth } from "@/modules/auth/hooks/authenticate";
import { isRoleAbove } from "@/modules/auth/hooks/authorise";
import { memberErrors } from "@/modules/members/errors";
import { listMemberIdsByRef } from "@/modules/members/repository/list-member-ids-by-ref";
import { listMembersById } from "@/modules/members/repository/list-members-by-id";
import { setMemberRoles } from "@/modules/members/repository/set-member-roles";
import type { RoleChange } from "@/modules/members/request";
import { QUIT_RANK_ID } from "@/modules/ranks/constants";

type Member = Awaited<ReturnType<typeof listMembersById>>[number];

/**
 * Gives a role, or removes any role when role is null. The caller can change
 * only members they outrank, so that no admin can demote another.
 */
export async function changeMemberRoles({ members, note, role }: RoleChange, auth: ActingAuth) {
  return db.transaction(async (tx) => {
    const memberIds = await listMemberIdsByRef(tx, members);
    const found = await listMembersById(tx, memberIds);

    const changed: { member: Member }[] = [];
    const skipped: { error: ApplicationError; member: Member }[] = [];

    for (const member of found) {
      const error = findSkipReason(member, role, auth);
      if (error) skipped.push({ member, error });
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

function findSkipReason(member: Member, role: RoleChange["role"], auth: ActingAuth) {
  if (!isRoleAbove(auth.member.role, member.role)) return memberErrors.roleTooHigh();
  if (role === null && member.role === null) return memberErrors.hasNoRole();
  if (role !== null && member.role === role) return memberErrors.alreadyHasRole(role);
  if (role !== null && member.rankId === QUIT_RANK_ID) return memberErrors.hasQuit();
}

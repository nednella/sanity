import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import type { Auth } from "@/modules/auth/hooks/authenticate";
import { QUIT_RANK_ID } from "@/modules/ranks/constants";

import { setMemberRole } from "../repository/set-member-role";
import type { RoleChange } from "../request";
import { executePerTaggedMember } from "./shared/execute-per-tagged-member";

/**
 * Gives or removes admin. A superuser is left alone, so that no superuser can
 * demote another.
 */
export async function changeMemberRoles({ note, role, taggedDiscordIds }: RoleChange, auth: Auth) {
  return executePerTaggedMember({ taggedDiscordIds }, async (tx, member) => {
    if (member.role === "superuser") return { outcome: "is-superuser" as const };
    if (member.role === role) {
      return { outcome: role === null ? ("not-an-admin" as const) : ("already-admin" as const) };
    }
    if (role !== null && member.rankId === QUIT_RANK_ID) return { outcome: "has-quit" as const };

    await setMemberRole(tx, member.id, role);
    await recordAuditEntry(tx, {
      actingMemberId: auth.member.id,
      action: "role_changed",
      affects: [member.id],
      note: note ?? `${member.role ?? "member"} to ${role ?? "member"}`,
      source: auth.client
    });

    return { outcome: role === null ? ("admin-removed" as const) : ("admin-given" as const) };
  });
}

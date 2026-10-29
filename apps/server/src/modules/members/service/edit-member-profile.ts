import { db } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import type { Auth } from "@/modules/auth/hooks/authenticate";

import { memberErrors } from "../errors";
import { type ProfileChanges, updateMemberProfile } from "../repository/update-member-profile";

function describeRename(label: string, previous: string | null, next: string | null) {
  return `${label} ${previous ?? "none"} to ${next ?? "none"}`;
}

export async function editMemberProfile(auth: Auth, profile: ProfileChanges) {
  return db.transaction(async (tx) => {
    const previous = await updateMemberProfile(tx, auth.member.id, profile);
    if (!previous) throw memberErrors.notFound(auth.member.id);

    const renames = [
      profile.mainRsn !== undefined && profile.mainRsn !== previous.mainRsn
        ? describeRename("main", previous.mainRsn, profile.mainRsn)
        : null,
      profile.altRsn !== undefined && profile.altRsn !== previous.altRsn
        ? describeRename("alt", previous.altRsn, profile.altRsn)
        : null
    ].filter(Boolean);

    if (renames.length > 0) {
      await recordAuditEntry(tx, {
        actingMemberId: auth.member.id,
        action: "rsn_changed",
        affects: [auth.member.id],
        note: renames.join(", "),
        source: auth.client
      });
    }
  });
}

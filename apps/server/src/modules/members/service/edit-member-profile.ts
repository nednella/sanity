import { db } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import type { Auth } from "@/modules/auth/hooks/authenticate";

import { memberErrors } from "../errors";
import { type ProfileChanges, updateMemberProfile } from "../repository/update-member-profile";

const describe = (label: string, previous: string | null, next: string | null) =>
  `${label} ${previous ?? "none"} to ${next ?? "none"}`;

export const editMemberProfile = async (auth: Auth, profile: ProfileChanges) =>
  db.transaction(async (tx) => {
    const previous = await updateMemberProfile(tx, auth.member.id, profile);
    if (!previous) throw memberErrors.notFound(auth.member.id);

    const renames = [
      profile.mainRsn !== undefined && profile.mainRsn !== previous.mainRsn
        ? describe("main", previous.mainRsn, profile.mainRsn)
        : null,
      profile.altRsn !== undefined && profile.altRsn !== previous.altRsn
        ? describe("alt", previous.altRsn, profile.altRsn)
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

import { db } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import type { Actor } from "@/modules/auth/service/authenticate";

import { memberErrors } from "../errors";
import { type ProfileChanges, updateMemberProfile } from "../repository/update-member-profile";

const describe = (label: string, previous: string | null, next: string | null) =>
  `${label} ${previous ?? "none"} to ${next ?? "none"}`;

export const editMemberProfile = async (actor: Actor, profile: ProfileChanges) =>
  db.transaction(async (tx) => {
    const previous = await updateMemberProfile(tx, actor.memberId, profile);
    if (!previous) throw memberErrors.notFound(actor.memberId);

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
        actingMemberId: actor.memberId,
        action: "rsn_changed",
        affects: [actor.memberId],
        note: renames.join(", "),
        source: actor.source
      });
    }
  });

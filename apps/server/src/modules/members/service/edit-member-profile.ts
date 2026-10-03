import { db } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";

import { type MemberProfile, updateMemberProfile } from "../repository/update-member-profile";

const describe = (label: string, previous: string | null, next: string | null) =>
  `${label} ${previous ?? "none"} to ${next ?? "none"}`;

export const editMemberProfile = async (
  memberId: bigint,
  { actingMemberId, ...profile }: MemberProfile & { actingMemberId?: bigint }
) =>
  db.transaction(async (tx) => {
    const previous = await updateMemberProfile(tx, memberId, profile);
    if (!previous) return false;

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
        actingMemberId,
        action: "rsn_changed",
        affects: [memberId],
        note: renames.join(", "),
        source: "server"
      });
    }

    return true;
  });

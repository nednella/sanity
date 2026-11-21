import { db } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import type { ActingAuth } from "@/modules/auth/hooks/authenticate";
import { awardPoints } from "@/modules/points/repository/award-points";

export type ManualAward = {
  memberId: bigint;
  notes: string;
  points: number;
};

export async function awardManualPoints({ memberId, notes, points }: ManualAward, auth: ActingAuth) {
  return db.transaction(async (tx) => {
    const awarded = await awardPoints(tx, [{ memberId, points }], {
      awardedBy: auth.member.id,
      notes,
      submissionId: null
    });

    await recordAuditEntry(tx, {
      actingMemberId: auth.member.id,
      action: "points_awarded",
      affects: [memberId],
      note: `${points} points: ${notes}`,
      source: auth.client
    });

    return awarded;
  });
}

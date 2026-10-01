import { db } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";

import { awardPoints } from "../repository/award-points";

export type ManualAward = {
  awardedByMemberId: bigint;
  memberId: bigint;
  notes: string;
  points: number;
};

export const awardManualPoints = async ({ awardedByMemberId, memberId, notes, points }: ManualAward) =>
  db.transaction(async (tx) => {
    const awarded = await awardPoints(tx, [{ memberId, points }], null, notes);

    await recordAuditEntry(tx, {
      actingMemberId: awardedByMemberId,
      action: "points_awarded",
      affects: [memberId],
      note: `${points} points: ${notes}`,
      source: "server"
    });

    return awarded;
  });

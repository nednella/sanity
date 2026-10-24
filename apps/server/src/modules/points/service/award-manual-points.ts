import { db } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import type { Actor } from "@/modules/auth/service/authenticate";

import { awardPoints } from "../repository/award-points";

export type ManualAward = {
  memberId: bigint;
  notes: string;
  points: number;
};

export const awardManualPoints = async ({ memberId, notes, points }: ManualAward, actor: Actor) =>
  db.transaction(async (tx) => {
    const awarded = await awardPoints(tx, [{ memberId, points }], actor.memberId, null, notes);

    await recordAuditEntry(tx, {
      actingMemberId: actor.memberId,
      action: "points_awarded",
      affects: [memberId],
      note: `${points} points: ${notes}`,
      source: actor.source
    });

    return awarded;
  });

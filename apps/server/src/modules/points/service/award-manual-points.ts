import { db } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import type { Auth } from "@/modules/auth/service/authenticate";

import { awardPoints } from "../repository/award-points";

export type ManualAward = {
  memberId: bigint;
  notes: string;
  points: number;
};

export const awardManualPoints = async ({ memberId, notes, points }: ManualAward, auth: Auth) =>
  db.transaction(async (tx) => {
    const awarded = await awardPoints(tx, [{ memberId, points }], auth.member.id, null, notes);

    await recordAuditEntry(tx, {
      actingMemberId: auth.member.id,
      action: "points_awarded",
      affects: [memberId],
      note: `${points} points: ${notes}`,
      source: auth.client
    });

    return awarded;
  });

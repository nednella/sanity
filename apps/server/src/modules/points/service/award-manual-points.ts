import { db } from "@db/index";

import { awardPoints } from "../repository/award-points";

export type ManualAward = {
  memberId: bigint;
  notes: string;
  points: number;
};

export const awardManualPoints = async ({ memberId, notes, points }: ManualAward) =>
  db.transaction(async (tx) => awardPoints(tx, [{ memberId, points }], null, notes));

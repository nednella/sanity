import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { members } from "@db/schema";

import { diaryProgressCte } from "@/modules/speedrun-diary/repository/diary-progress-cte";

export const findMemberStanding = async (tx: Transaction, memberId: bigint) => {
  const { bestTimes, diaryProgress, diaryTotals, reachedTiers } = diaryProgressCte([memberId]);

  const [standing] = await tx
    .with(bestTimes, reachedTiers, diaryProgress)
    .select({
      clanPoints: members.clanPoints,
      diaryPoints: diaryTotals.diaryPoints,
      masterDiaries: diaryTotals.masterDiaries,
      rankId: members.rankId
    })
    .from(members)
    .leftJoin(diaryProgress, eq(diaryProgress.memberId, members.id))
    .where(eq(members.id, memberId));

  return standing;
};

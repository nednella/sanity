import { and, eq, inArray } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { discordAccounts, memberRankDelays, members } from "@db/schema";

import { diaryProgressQueries } from "@/modules/speedrun-diary/repository/diary-progress-queries";

export function listMemberStandings(tx: Transaction, memberIds?: bigint[]) {
  const { bestTimes, diaryProgress, diaryTotals, reachedTiers } = diaryProgressQueries(memberIds);

  return tx
    .with(bestTimes, reachedTiers, diaryProgress)
    .select({
      claimedDiaryTierId: members.claimedDiaryTierId,
      clanPoints: members.clanPoints,
      diaryPoints: diaryTotals.diaryPoints,
      discordId: discordAccounts.discordId,
      displayName: members.displayName,
      id: members.id,
      masterDiaries: diaryTotals.masterDiaries,
      delayedUntil: memberRankDelays.until,
      rankId: members.rankId
    })
    .from(members)
    .innerJoin(discordAccounts, eq(discordAccounts.memberId, members.id))
    .leftJoin(diaryProgress, eq(diaryProgress.memberId, members.id))
    .leftJoin(memberRankDelays, eq(memberRankDelays.memberId, members.id))
    .where(and(eq(members.isActive, true), memberIds && inArray(members.id, memberIds)));
}

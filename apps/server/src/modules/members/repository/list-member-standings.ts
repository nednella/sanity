import { and, eq, inArray } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { memberRankDelays, members, membersDiscordAccounts } from "@db/schema";

import { diaryProgressCte } from "@/modules/speedrun-diary/repository/diary-progress-cte";

export const listMemberStandings = (tx: Transaction, memberIds?: bigint[]) => {
  const { bestTimes, diaryProgress, diaryTotals, reachedTiers } = diaryProgressCte(memberIds);

  return tx
    .with(bestTimes, reachedTiers, diaryProgress)
    .select({
      claimedDiaryTierId: members.claimedDiaryTierId,
      clanPoints: members.clanPoints,
      diaryPoints: diaryTotals.diaryPoints,
      discordId: membersDiscordAccounts.discordId,
      displayName: members.displayName,
      id: members.id,
      masterDiaries: diaryTotals.masterDiaries,
      delayedUntil: memberRankDelays.until,
      rankId: members.rankId
    })
    .from(members)
    .innerJoin(membersDiscordAccounts, eq(membersDiscordAccounts.memberId, members.id))
    .leftJoin(diaryProgress, eq(diaryProgress.memberId, members.id))
    .leftJoin(memberRankDelays, eq(memberRankDelays.memberId, members.id))
    .where(and(eq(members.isActive, true), memberIds && inArray(members.id, memberIds)));
};

import { and, eq, inArray, sql } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { memberRankDelays, members, membersDiscordAccounts } from "@db/schema";

import { diaryProgressCte } from "@/modules/speedrun-diary/repository/diary-progress-cte";

export const listMemberStandings = (tx: Transaction, memberIds?: bigint[]) => {
  const { bestTimes, diaryProgress, reachedTiers } = diaryProgressCte(memberIds);

  return tx
    .with(bestTimes, reachedTiers, diaryProgress)
    .select({
      claimedDiaryTierId: members.claimedDiaryTierId,
      clanPoints: members.clanPoints,
      diaryPoints: sql<number>`coalesce(${diaryProgress.diaryPoints}, 0)`.mapWith(Number),
      discordId: membersDiscordAccounts.discordId,
      displayName: members.displayName,
      id: members.id,
      masterDiaries: sql<number>`coalesce(${diaryProgress.masterDiaries}, 0)`.mapWith(Number),
      delayedUntil: memberRankDelays.until,
      rankId: members.rankId
    })
    .from(members)
    .innerJoin(membersDiscordAccounts, eq(membersDiscordAccounts.memberId, members.id))
    .leftJoin(diaryProgress, eq(diaryProgress.memberId, members.id))
    .leftJoin(memberRankDelays, eq(memberRankDelays.memberId, members.id))
    .where(and(eq(members.isActive, true), memberIds && inArray(members.id, memberIds)));
};

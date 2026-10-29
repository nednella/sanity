import { eq } from "drizzle-orm";

import { db } from "@db/index";
import { discordAccounts, members, ranks, speedrunDiaryTiers, womPlayers } from "@db/schema";

import type { diaryProgressQueries } from "@/modules/speedrun-diary/repository/diary-progress-queries";

import { memberColumns } from "./columns";

export function selectMembers({ bestTimes, reachedTiers, diaryProgress }: ReturnType<typeof diaryProgressQueries>) {
  return db
    .with(bestTimes, reachedTiers, diaryProgress)
    .select({
      ...memberColumns,
      diaryProgress: {
        diaryPoints: diaryProgress.diaryPoints,
        masterDiaries: diaryProgress.masterDiaries
      }
    })
    .from(members)
    .innerJoin(discordAccounts, eq(discordAccounts.memberId, members.id))
    .innerJoin(ranks, eq(ranks.id, members.rankId))
    .leftJoin(speedrunDiaryTiers, eq(speedrunDiaryTiers.id, members.claimedDiaryTierId))
    .leftJoin(womPlayers, eq(womPlayers.memberId, members.id))
    .leftJoin(diaryProgress, eq(diaryProgress.memberId, members.id));
}

// Every member read returns this shape, and both mappers consume it.
export type MemberRow = Awaited<ReturnType<typeof selectMembers>>[number];

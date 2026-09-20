import type { SQL } from "drizzle-orm";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

import { db } from "@db/index";
import { members, membersDiscordAccounts, ranks, speedrunDiaryTiers, womPlayers } from "@db/schema";

import { diaryProgressCte } from "@/modules/speedrun-diary/repository/diary-progress-cte";

import type { MemberSort } from "../request";
import { memberColumns } from "./shared/columns";
import { isActive, matchesSearch } from "./shared/filters";

export type ListMembersOptions = {
  limit: number;
  offset: number;
  active?: boolean;
  search?: string;
  sort: MemberSort;
  order: "asc" | "desc";
};

export const listMembers = ({ limit, offset, active, search, sort, order }: ListMembersOptions) => {
  const { bestTimes, reachedTiers, diaryProgress } = diaryProgressCte();
  const direction = order === "asc" ? asc : desc;

  const sortColumns: Record<MemberSort, PgColumn | SQL> = {
    clanPoints: members.clanPoints,
    diaryPoints: sql`coalesce(${diaryProgress.diaryPoints}, 0)`,
    displayName: members.displayName,
    joinedAt: sql`coalesce(${members.joinedAt}, to_timestamp(0))`,
    masterDiaries: sql`coalesce(${diaryProgress.masterDiaries}, 0)`,
    rank: ranks.id,
    totalEhb: sql`coalesce(${womPlayers.totalEhb}, 0)`,
    totalEhp: sql`coalesce(${womPlayers.totalEhp}, 0)`,
    totalExp: sql`coalesce(${womPlayers.totalExp}, 0)`,
    totalLevel: sql`coalesce(${womPlayers.totalLevel}, 0)`
  };

  return db
    .with(bestTimes, reachedTiers, diaryProgress)
    .select(memberColumns)
    .from(members)
    .innerJoin(membersDiscordAccounts, eq(membersDiscordAccounts.memberId, members.id))
    .innerJoin(ranks, eq(ranks.id, members.rankId))
    .leftJoin(speedrunDiaryTiers, eq(speedrunDiaryTiers.id, members.claimedDiaryTierId))
    .leftJoin(womPlayers, eq(womPlayers.memberId, members.id))
    .leftJoin(diaryProgress, eq(diaryProgress.memberId, members.id))
    .where(and(isActive(active), matchesSearch(search)))
    .orderBy(direction(sortColumns[sort]), members.id)
    .limit(limit)
    .offset(offset);
};

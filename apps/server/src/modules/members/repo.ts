import type { SQL } from "drizzle-orm";
import { asc, count, desc, eq, sql } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

import { db } from "../../../db/index";
import { members, membersDiscordAccounts, ranks, speedrunDiaryTiers, womPlayers } from "../../../db/schema";
import { diaryProgressCte } from "../speedrun-diary/repo";
import type { MemberSort } from "./request";

type ListOptions = {
  limit: number;
  offset: number;
  active?: boolean;
  sort: MemberSort;
  order: "asc" | "desc";
};

const isActive = (active: boolean | undefined) => (active === undefined ? undefined : eq(members.isActive, active));

const memberColumns = {
  member: members,
  discordAccount: membersDiscordAccounts,
  rank: ranks,
  claimedDiaryTier: speedrunDiaryTiers,
  womPlayer: womPlayers
};

const selectMembers = () =>
  db
    .select(memberColumns)
    .from(members)
    .innerJoin(membersDiscordAccounts, eq(membersDiscordAccounts.memberId, members.id))
    .innerJoin(ranks, eq(ranks.id, members.rankId))
    .leftJoin(speedrunDiaryTiers, eq(speedrunDiaryTiers.id, members.claimedDiaryTierId))
    .leftJoin(womPlayers, eq(womPlayers.memberId, members.id));

export const listMembers = ({ limit, offset, active, sort, order }: ListOptions) => {
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
    .where(isActive(active))
    .orderBy(direction(sortColumns[sort]), members.id)
    .limit(limit)
    .offset(offset);
};

export const countMembers = async ({ active }: Pick<ListOptions, "active">) => {
  const [row] = await db.select({ value: count() }).from(members).where(isActive(active));
  return row?.value ?? 0;
};

export const findMember = async (id: bigint) => {
  const [row] = await selectMembers().where(eq(members.id, id));
  return row;
};

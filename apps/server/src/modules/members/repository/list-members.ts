import { type SQL, and, asc, desc, sql } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

import { members, ranks, womPlayers } from "@db/schema";

import { diaryProgressQueries } from "@/modules/speedrun-diary/repository/diary-progress-queries";

import type { MemberSort } from "../request";
import { isActive, matchesSearch } from "./shared/filters";
import { selectMembers } from "./shared/select-members";

export type ListMembersOptions = {
  limit: number;
  offset: number;
  active?: boolean;
  search?: string;
  sort: MemberSort;
  order: "asc" | "desc";
};

export function listMembers({ limit, offset, active, search, sort, order }: ListMembersOptions) {
  const progress = diaryProgressQueries();
  const { diaryTotals } = progress;
  const direction = order === "asc" ? asc : desc;

  const sortColumns: Record<MemberSort, PgColumn | SQL> = {
    clanPoints: members.clanPoints,
    diaryPoints: diaryTotals.diaryPoints,
    displayName: members.displayName,
    joinedAt: sql`coalesce(${members.joinedAt}, to_timestamp(0))`,
    masterDiaries: diaryTotals.masterDiaries,
    rank: ranks.id,
    totalEhb: sql`coalesce(${womPlayers.totalEhb}, 0)`,
    totalEhp: sql`coalesce(${womPlayers.totalEhp}, 0)`,
    totalExp: sql`coalesce(${womPlayers.totalExp}, 0)`,
    totalLevel: sql`coalesce(${womPlayers.totalLevel}, 0)`
  };

  return selectMembers(progress)
    .where(and(isActive(active), matchesSearch(search)))
    .orderBy(direction(sortColumns[sort]), members.id)
    .limit(limit)
    .offset(offset);
}

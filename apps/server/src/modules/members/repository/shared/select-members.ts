import { eq } from "drizzle-orm";

import { db } from "@db/index";
import { members, membersDiscordAccounts, ranks, speedrunDiaryTiers, womPlayers } from "@db/schema";

import { memberColumns } from "./columns";

export const selectMembers = () =>
  db
    .select(memberColumns)
    .from(members)
    .innerJoin(membersDiscordAccounts, eq(membersDiscordAccounts.memberId, members.id))
    .innerJoin(ranks, eq(ranks.id, members.rankId))
    .leftJoin(speedrunDiaryTiers, eq(speedrunDiaryTiers.id, members.claimedDiaryTierId))
    .leftJoin(womPlayers, eq(womPlayers.memberId, members.id));

// Every member read returns this shape, and both mappers consume it.
export type MemberRow = Awaited<ReturnType<typeof selectMembers>>[number];

import { desc, eq } from "drizzle-orm";

import { db } from "../../../db/index.js";
import { members, membersDiscordAccounts, ranks, speedrunDiaryTiers, womPlayers } from "../../../db/schema.js";

type ListOptions = {
  limit: number;
  offset: number;
  active: boolean;
};

const selectMembers = () =>
  db
    .select({
      member: members,
      discordAccount: membersDiscordAccounts,
      rank: ranks,
      claimedDiaryTier: speedrunDiaryTiers,
      womPlayer: womPlayers
    })
    .from(members)
    .innerJoin(membersDiscordAccounts, eq(membersDiscordAccounts.memberId, members.id))
    .innerJoin(ranks, eq(ranks.id, members.rankId))
    .leftJoin(speedrunDiaryTiers, eq(speedrunDiaryTiers.id, members.claimedDiaryTierId))
    .leftJoin(womPlayers, eq(womPlayers.memberId, members.id));

export const listMembers = ({ limit, offset, active }: ListOptions) =>
  selectMembers().where(eq(members.isActive, active)).orderBy(desc(members.clanPoints)).limit(limit).offset(offset);

export const findMember = async (id: bigint) => {
  const [row] = await selectMembers().where(eq(members.id, id));
  return row;
};

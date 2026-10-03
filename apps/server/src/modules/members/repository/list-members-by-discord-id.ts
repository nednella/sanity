import { eq, inArray } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { members, membersDiscordAccounts } from "@db/schema";

export const listMembersByDiscordId = async (tx: Transaction, discordIds: bigint[]) => {
  if (discordIds.length === 0) return new Map<bigint, { displayName: string; id: bigint; rankId: number }>();

  const rows = await tx
    .select({
      discordId: membersDiscordAccounts.discordId,
      displayName: members.displayName,
      id: members.id,
      rankId: members.rankId
    })
    .from(membersDiscordAccounts)
    .innerJoin(members, eq(members.id, membersDiscordAccounts.memberId))
    .where(inArray(membersDiscordAccounts.discordId, discordIds));

  return new Map(rows.map(({ discordId, ...member }) => [discordId, member]));
};

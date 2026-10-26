import { eq, inArray } from "drizzle-orm";

import type { MemberRole } from "@db/enums";
import type { Transaction } from "@db/index";
import { discordAccounts, members } from "@db/schema";

export const listMembersByDiscordId = async (tx: Transaction, discordIds: bigint[]) => {
  if (discordIds.length === 0)
    return new Map<bigint, { displayName: string; id: bigint; rankId: number; role: MemberRole | null }>();

  const rows = await tx
    .select({
      discordId: discordAccounts.discordId,
      displayName: members.displayName,
      id: members.id,
      rankId: members.rankId,
      role: members.role
    })
    .from(discordAccounts)
    .innerJoin(members, eq(members.id, discordAccounts.memberId))
    .where(inArray(discordAccounts.discordId, discordIds));

  return new Map(rows.map(({ discordId, ...member }) => [discordId, member]));
};

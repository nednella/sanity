import { and, eq, ne } from "drizzle-orm";

import { type Transaction, db } from "@db/index";
import { discordAccounts, members } from "@db/schema";

import { QUIT_RANK_ID } from "@/modules/ranks/constants";

export const findMemberIdByDiscordId = async (tx: Transaction, discordId: bigint) => {
  const [account] = await tx
    .select({ memberId: discordAccounts.memberId })
    .from(discordAccounts)
    .where(eq(discordAccounts.discordId, discordId));

  return account?.memberId;
};

/**
 * Finds the member with this Discord ID who has not quit the clan.
 */
export async function findClanMemberIdByDiscordId(discordId: bigint) {
  const [member] = await db
    .select({ id: members.id })
    .from(members)
    .innerJoin(discordAccounts, eq(discordAccounts.memberId, members.id))
    .where(and(eq(discordAccounts.discordId, discordId), ne(members.rankId, QUIT_RANK_ID)));

  return member?.id;
}

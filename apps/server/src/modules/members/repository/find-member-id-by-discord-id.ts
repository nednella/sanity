import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { membersDiscordAccounts } from "@db/schema";

export const findMemberIdByDiscordId = async (tx: Transaction, discordId: bigint | undefined) => {
  if (discordId === undefined) return;

  const [account] = await tx
    .select({ memberId: membersDiscordAccounts.memberId })
    .from(membersDiscordAccounts)
    .where(eq(membersDiscordAccounts.discordId, discordId));

  return account?.memberId;
};

import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { discordAccounts } from "@db/schema";

export const findMemberIdByDiscordId = async (tx: Transaction, discordId: bigint) => {
  const [account] = await tx
    .select({ memberId: discordAccounts.memberId })
    .from(discordAccounts)
    .where(eq(discordAccounts.discordId, discordId));

  return account?.memberId;
};

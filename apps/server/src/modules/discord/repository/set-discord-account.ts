import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { discordAccounts } from "@db/schema";

export const setDiscordAccount = async (
  tx: Transaction,
  memberId: bigint,
  account: { avatarUrl: string | null; discordId: bigint }
) => {
  await tx.update(discordAccounts).set(account).where(eq(discordAccounts.memberId, memberId));
};

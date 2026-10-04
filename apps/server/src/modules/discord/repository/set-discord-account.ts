import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { membersDiscordAccounts } from "@db/schema";

export const setDiscordAccount = async (
  tx: Transaction,
  memberId: bigint,
  account: { avatarUrl: string | null; discordId: bigint }
) => {
  await tx.update(membersDiscordAccounts).set(account).where(eq(membersDiscordAccounts.memberId, memberId));
};

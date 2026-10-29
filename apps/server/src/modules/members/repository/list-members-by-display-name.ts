import { eq, sql } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { discordAccounts, members } from "@db/schema";

export function listMembersByDisplayName(tx: Transaction, displayName: string) {
  return tx
    .select({ discordId: discordAccounts.discordId, displayName: members.displayName, id: members.id })
    .from(members)
    .innerJoin(discordAccounts, eq(discordAccounts.memberId, members.id))
    .where(sql`lower(${members.displayName}) = lower(${displayName})`);
}

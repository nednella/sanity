import { eq, sql } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { members, membersDiscordAccounts } from "@db/schema";

export const listMembersByDisplayName = (tx: Transaction, displayName: string) =>
  tx
    .select({ discordId: membersDiscordAccounts.discordId, displayName: members.displayName, id: members.id })
    .from(members)
    .innerJoin(membersDiscordAccounts, eq(membersDiscordAccounts.memberId, members.id))
    .where(sql`lower(${members.displayName}) = lower(${displayName})`);

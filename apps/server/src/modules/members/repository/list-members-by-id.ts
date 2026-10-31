import { eq, inArray } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { discordAccounts, members } from "@db/schema";

export function listMembersById(tx: Transaction, memberIds: bigint[]) {
  return tx
    .select({
      discordId: discordAccounts.discordId,
      displayName: members.displayName,
      id: members.id,
      pluginAccessRevokedAt: members.pluginAccessRevokedAt,
      rankId: members.rankId,
      role: members.role
    })
    .from(members)
    .innerJoin(discordAccounts, eq(discordAccounts.memberId, members.id))
    .where(inArray(members.id, memberIds));
}

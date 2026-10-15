import { eq } from "drizzle-orm";

import { db } from "@db/index";
import { members, membersDiscordAccounts } from "@db/schema";

export const findMemberByDiscordId = async (discordId: bigint) => {
  const [member] = await db
    .select({
      id: members.id,
      displayName: members.displayName
    })
    .from(membersDiscordAccounts)
    .innerJoin(members, eq(members.id, membersDiscordAccounts.memberId))
    .where(eq(membersDiscordAccounts.discordId, discordId));

  return member;
};

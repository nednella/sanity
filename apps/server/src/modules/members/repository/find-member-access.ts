import { and, eq, ne } from "drizzle-orm";

import { db } from "@db/index";
import { discordAccounts, members } from "@db/schema";

import { QUIT_RANK_ID } from "@/modules/ranks/constants";

export async function findMemberAccessById(id: bigint) {
  const [member] = await db
    .select({
      id: members.id,
      role: members.role
    })
    .from(members)
    .where(and(eq(members.id, id), ne(members.rankId, QUIT_RANK_ID)));

  return member;
}

export async function findMemberAccessByDiscordId(discordId: bigint) {
  const [member] = await db
    .select({
      id: members.id,
      role: members.role
    })
    .from(members)
    .innerJoin(discordAccounts, eq(discordAccounts.memberId, members.id))
    .where(and(eq(discordAccounts.discordId, discordId), ne(members.rankId, QUIT_RANK_ID)));

  return member;
}

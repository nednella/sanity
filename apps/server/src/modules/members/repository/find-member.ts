import { eq } from "drizzle-orm";

import { db } from "@db/index";
import { discordAccounts, members } from "@db/schema";

import { diaryProgressQueries } from "@/modules/speedrun-diary/repository/diary-progress-queries";

import { selectMembers } from "./shared/select-members";

export async function findMemberById(id: bigint) {
  const [row] = await selectMembers(diaryProgressQueries([id])).where(eq(members.id, id));
  return row;
}

export async function findMemberByDiscordId(discordId: bigint) {
  const member = db
    .select({ id: discordAccounts.memberId })
    .from(discordAccounts)
    .where(eq(discordAccounts.discordId, discordId));

  const [row] = await selectMembers(diaryProgressQueries(member)).where(eq(discordAccounts.discordId, discordId));
  return row;
}

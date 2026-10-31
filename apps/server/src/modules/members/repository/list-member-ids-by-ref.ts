import { eq, inArray, or } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { discordAccounts, members } from "@db/schema";

import type { MemberRef } from "../request";

// Some clients are limited to what data they have available to them. E.g. the
// Discord bot doesn't know a member ID, only the members' Discord user ID,
// so we allow either reference to be used!
export async function listMemberIdsByRef(tx: Transaction, requested: MemberRef[]) {
  const memberIds = requested.flatMap((ref) => ("memberId" in ref ? [ref.memberId] : []));
  const discordIds = requested.flatMap((ref) => ("discordId" in ref ? [ref.discordId] : []));

  const rows = await tx
    .select({ id: members.id })
    .from(members)
    .innerJoin(discordAccounts, eq(discordAccounts.memberId, members.id))
    .where(or(inArray(members.id, memberIds), inArray(discordAccounts.discordId, discordIds)));

  return rows.map(({ id }) => id);
}

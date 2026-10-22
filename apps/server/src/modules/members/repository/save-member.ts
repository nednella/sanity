import type { Transaction } from "@db/index";
import { discordAccounts, members } from "@db/schema";

import { TRIALIST_RANK_ID } from "@/modules/ranks/constants";

import type { NewMember } from "../request";

export const saveMember = async (tx: Transaction, { discordId, ...member }: NewMember) => {
  const [inserted] = await tx
    .insert(members)
    .values({ ...member, isActive: true, joinedAt: new Date(), rankId: TRIALIST_RANK_ID })
    .returning({ id: members.id });

  await tx.insert(discordAccounts).values({ discordId, memberId: inserted!.id });

  return inserted!.id;
};

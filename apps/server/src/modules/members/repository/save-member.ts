import type { Transaction } from "@db/index";
import { members, membersDiscordAccounts } from "@db/schema";

import { TRIALIST_RANK_ID } from "@/modules/ranks/constants";

export type NewMember = {
  altRsn: string | null;
  discordId: bigint;
  displayName: string;
  mainRsn: string;
};

export const saveMember = async (tx: Transaction, { discordId, ...member }: NewMember) => {
  const [inserted] = await tx
    .insert(members)
    .values({ ...member, isActive: true, joinedAt: new Date(), rankId: TRIALIST_RANK_ID })
    .returning({ id: members.id });

  await tx.insert(membersDiscordAccounts).values({ discordId, memberId: inserted!.id });

  return inserted!.id;
};

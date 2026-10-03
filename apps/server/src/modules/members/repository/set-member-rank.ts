import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { members } from "@db/schema";

import { QUIT_RANK_ID, RETIRED_RANK_ID } from "@/modules/ranks/constants";

export const setMemberRank = async (tx: Transaction, memberId: bigint, rankId: number) => {
  const [member] = await tx.select({ rankId: members.rankId }).from(members).where(eq(members.id, memberId));
  if (!member || member.rankId === rankId) return;

  await tx
    .update(members)
    .set({
      isActive: rankId > RETIRED_RANK_ID,
      leftAt: rankId === QUIT_RANK_ID ? new Date() : null,
      rankId
    })
    .where(eq(members.id, memberId));

  return { previous: member.rankId };
};

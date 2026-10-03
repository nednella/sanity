import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { memberRankDelays, members } from "@db/schema";

import { TRIALIST_RANK_ID } from "@/modules/ranks/constants";

export const startMemberTrial = async (tx: Transaction, memberId: bigint) => {
  const [member] = await tx
    .select({ clanPoints: members.clanPoints, rankId: members.rankId })
    .from(members)
    .where(eq(members.id, memberId));
  if (!member) return;

  await tx
    .update(members)
    .set({
      clanPoints: 0,
      isActive: true,
      joinedAt: new Date(),
      leftAt: null,
      rankId: TRIALIST_RANK_ID
    })
    .where(eq(members.id, memberId));

  await tx.delete(memberRankDelays).where(eq(memberRankDelays.memberId, memberId));

  return { pointsCleared: member.clanPoints, previousRankId: member.rankId };
};

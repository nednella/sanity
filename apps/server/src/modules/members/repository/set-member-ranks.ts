import { inArray } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { members } from "@db/schema";

import { QUIT_RANK_ID, RETIRED_RANK_ID } from "@/modules/ranks/constants";

type MemberRank = {
  memberId: bigint;
  rankId: number;
};

export async function setMemberRanks(tx: Transaction, memberRanks: MemberRank[]) {
  const membersByRank = Map.groupBy(memberRanks, ({ rankId }) => rankId);

  for (const [rankId, group] of membersByRank) {
    const memberIds = group.map(({ memberId }) => memberId);

    await tx
      .update(members)
      .set({
        isActive: rankId > RETIRED_RANK_ID,
        leftAt: rankId === QUIT_RANK_ID ? new Date() : null,
        rankId
      })
      .where(inArray(members.id, memberIds));
  }
}

import { inArray } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { members } from "@db/schema";

import { TRIALIST_RANK_ID } from "@/modules/ranks/constants";

// Trial status is read when the drop is approved, not when it was submitted, so a member who has
// since been ranked up is paid as a member.
export const listTrialists = async (tx: Transaction, memberIds: bigint[]) => {
  if (memberIds.length === 0) return new Set<bigint>();

  const rows = await tx
    .select({ id: members.id, rankId: members.rankId })
    .from(members)
    .where(inArray(members.id, memberIds));

  return new Set(rows.filter(({ rankId }) => rankId === TRIALIST_RANK_ID).map(({ id }) => id));
};

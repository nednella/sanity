import { and, eq, inArray } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { members } from "@db/schema";

import { TRIALIST_RANK_ID } from "@/modules/ranks/constants";

// Trial status is read when the drop is approved, not when it was submitted, so a member who has
// since been ranked up is paid as a member.
export async function listTrialists(tx: Transaction, memberIds: bigint[]) {
  if (memberIds.length === 0) return new Set<bigint>();

  const rows = await tx
    .select({ id: members.id })
    .from(members)
    .where(and(inArray(members.id, memberIds), eq(members.rankId, TRIALIST_RANK_ID)));

  return new Set(rows.map(({ id }) => id));
}

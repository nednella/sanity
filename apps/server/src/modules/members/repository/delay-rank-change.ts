import { sql } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { memberRankDelays } from "@db/schema";

export const delayRankChange = async (tx: Transaction, memberIds: bigint[], until: Date) => {
  if (memberIds.length === 0) return;

  await tx
    .insert(memberRankDelays)
    .values(memberIds.map((memberId) => ({ memberId, until })))
    .onConflictDoUpdate({ target: memberRankDelays.memberId, set: { until: sql`excluded.until` } });
};

import { eq, sql } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { items, submissions } from "@db/schema";

export const findSubmissionForReview = async (tx: Transaction, id: number) => {
  const [found] = await tx
    .select({
      id: submissions.id,
      itemName: sql<string | null>`coalesce(${items.name}, ${submissions.itemName})`,
      nonClanCount: submissions.nonClanCount,
      status: submissions.status,
      valueMillions: submissions.valueMillions
    })
    .from(submissions)
    .leftJoin(items, eq(items.id, submissions.itemId))
    .where(eq(submissions.id, id))
    .for("update", { of: submissions });

  return found;
};

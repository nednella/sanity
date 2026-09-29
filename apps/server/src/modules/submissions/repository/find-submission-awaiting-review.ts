import { and, eq, sql } from "drizzle-orm";

import type { Queryable } from "@db/index";
import { items, submissions } from "@db/schema";

import { isAwaitingReview } from "./shared/filters";

export const findSubmissionAwaitingReview = async (tx: Queryable, id: number) => {
  const [found] = await tx
    .select({
      id: submissions.id,
      itemName: sql<string | null>`coalesce(${items.name}, ${submissions.itemName})`,
      nonClanCount: submissions.nonClanCount,
      valueMillions: submissions.valueMillions
    })
    .from(submissions)
    .leftJoin(items, eq(items.id, submissions.itemId))
    .where(and(eq(submissions.id, id), isAwaitingReview))
    .for("update", { of: submissions });

  return found;
};

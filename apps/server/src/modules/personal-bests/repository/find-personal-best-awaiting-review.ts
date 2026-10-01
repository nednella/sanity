import { and, eq, sql } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { personalBests } from "@db/schema";

import { isAwaitingReview } from "./shared/filters";

export const findPersonalBestAwaitingReview = async (tx: Transaction, id: number) => {
  const [found] = await tx
    .select({
      id: personalBests.id,
      contentId: personalBests.contentId,
      scale: personalBests.scale,
      timeSeconds: sql<number>`extract(epoch from ${personalBests.time})::float8`
    })
    .from(personalBests)
    .where(and(eq(personalBests.id, id), isAwaitingReview))
    .for("update");

  return found;
};

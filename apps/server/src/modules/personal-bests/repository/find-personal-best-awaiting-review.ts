import { and, eq } from "drizzle-orm";

import type { Queryable } from "@db/index";
import { personalBests } from "@db/schema";

import { isAwaitingReview } from "./shared/filters";

export const findPersonalBestAwaitingReview = async (tx: Queryable, id: number) => {
  const [found] = await tx
    .select({ id: personalBests.id })
    .from(personalBests)
    .where(and(eq(personalBests.id, id), isAwaitingReview))
    .for("update");

  return found;
};

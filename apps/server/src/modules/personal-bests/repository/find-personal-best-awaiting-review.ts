import { and, eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { personalBests } from "@db/schema";

import { epochSeconds } from "@/utils/sql";

import { isAwaitingReview } from "./shared/filters";

export const findPersonalBestAwaitingReview = async (tx: Transaction, id: number) => {
  const [found] = await tx
    .select({
      id: personalBests.id,
      contentId: personalBests.contentId,
      scale: personalBests.scale,
      timeSeconds: epochSeconds(personalBests.time)
    })
    .from(personalBests)
    .where(and(eq(personalBests.id, id), isAwaitingReview))
    .for("update");

  return found;
};

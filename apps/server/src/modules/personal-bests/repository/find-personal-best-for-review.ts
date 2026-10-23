import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { personalBests } from "@db/schema";

import { epochSeconds } from "@/utils/sql";

export const findPersonalBestForReview = async (tx: Transaction, id: number) => {
  const [found] = await tx
    .select({
      id: personalBests.id,
      contentId: personalBests.contentId,
      scale: personalBests.scale,
      status: personalBests.status,
      timeSeconds: epochSeconds(personalBests.time)
    })
    .from(personalBests)
    .where(eq(personalBests.id, id))
    .for("update");

  return found;
};

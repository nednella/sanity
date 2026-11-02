import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { personalBests } from "@db/schema";

import { epochSeconds } from "@/utils/sql";

export async function findPersonalBestForReview(tx: Transaction, id: number) {
  const [found] = await tx
    .select({
      id: personalBests.id,
      contentId: personalBests.contentId,
      scale: personalBests.scale,
      status: personalBests.status,
      submittedAt: personalBests.submittedAt,
      timeSeconds: epochSeconds(personalBests.time)
    })
    .from(personalBests)
    .where(eq(personalBests.id, id))
    .for("update");

  return found;
}

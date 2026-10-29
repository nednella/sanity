import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { personalBests } from "@db/schema";

import type { Review } from "@/schema/common";

export function reviewPersonalBest(tx: Transaction, id: number, review: Review, reviewedBy: bigint) {
  return tx
    .update(personalBests)
    .set({ ...review, reviewedAt: new Date(), reviewedBy })
    .where(eq(personalBests.id, id));
}

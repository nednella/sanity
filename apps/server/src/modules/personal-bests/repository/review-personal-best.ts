import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { personalBests } from "@db/schema";

import type { Review } from "@/schema/common";

export const reviewPersonalBest = (tx: Transaction, id: number, review: Review) =>
  tx
    .update(personalBests)
    .set({ ...review, reviewedAt: new Date() })
    .where(eq(personalBests.id, id));

import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { personalBests } from "@db/schema";

export type Review = {
  reviewNote: string | null;
  reviewedBy: bigint;
  status: "approved" | "denied";
};

export const reviewPersonalBest = (tx: Transaction, id: number, review: Review) =>
  tx
    .update(personalBests)
    .set({ ...review, reviewedAt: new Date() })
    .where(eq(personalBests.id, id));

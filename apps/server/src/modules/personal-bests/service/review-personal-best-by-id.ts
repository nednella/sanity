import { db } from "@db/index";

import { findPersonalBestAwaitingReview } from "../repository/find-personal-best-awaiting-review";
import { reviewPersonalBest } from "../repository/review-personal-best";

export type ReviewRequest = {
  reviewNote: string | null;
  reviewedBy: bigint;
  status: "approved" | "denied";
};

export type ReviewResult = "reviewed" | "not-awaiting-review";

/**
 * Approving a run pays no points: the speedrun diary reads the times themselves, so a member's
 * diary standing follows from this the moment it counts as approved.
 */
export const reviewPersonalBestById = async (id: number, review: ReviewRequest): Promise<ReviewResult> =>
  db.transaction(async (tx) => {
    const awaiting = await findPersonalBestAwaitingReview(tx, id);
    if (!awaiting) return "not-awaiting-review";

    await reviewPersonalBest(tx, id, review);

    return "reviewed";
  });

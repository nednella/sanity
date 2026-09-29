import { db } from "@db/index";

import { findSubmissionAwaitingReview } from "../repository/find-submission-awaiting-review";
import { reviewSubmission } from "../repository/review-submission";

export type ReviewRequest = {
  reviewNote: string | null;
  reviewedBy: bigint;
  status: "approved" | "denied";
};

export type ReviewResult = "reviewed" | "not-awaiting-review";

/**
 * The submission is read and written in one transaction, with the row locked while it runs, so two
 * reviewers cannot both take it. One already reviewed is refused rather than reviewed twice.
 */
export const reviewSubmissionById = async (id: number, review: ReviewRequest): Promise<ReviewResult> =>
  db.transaction(async (tx) => {
    const awaiting = await findSubmissionAwaitingReview(tx, id);
    if (!awaiting) return "not-awaiting-review";

    await reviewSubmission(tx, id, review);

    return "reviewed";
  });

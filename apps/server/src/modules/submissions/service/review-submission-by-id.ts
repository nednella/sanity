import { db } from "@db/index";

import { awardPoints } from "@/modules/points/repository/award-points";
import { generatePointSplit } from "@/modules/points/rules";

import { findSubmissionAwaitingReview } from "../repository/find-submission-awaiting-review";
import { listParticipantIds } from "../repository/list-participant-ids";
import { listTrialists } from "../repository/list-trialists";
import { reviewSubmission } from "../repository/review-submission";

export type ReviewRequest = {
  reviewNote: string | null;
  reviewedBy: bigint;
  status: "approved" | "denied";
};

export type ReviewResult = "reviewed" | "not-awaiting-review";

/**
 * Approving is what pays out, so the read of the submission, the points and the members' totals all
 * happen in one transaction, and the row is locked while it runs. A submission already reviewed is
 * refused rather than paid twice.
 */
export const reviewSubmissionById = async (id: number, review: ReviewRequest): Promise<ReviewResult> =>
  db.transaction(async (tx) => {
    const awaiting = await findSubmissionAwaitingReview(tx, id);
    if (!awaiting) return "not-awaiting-review";

    await reviewSubmission(tx, id, review);
    if (review.status === "denied") return "reviewed";

    const memberIds = await listParticipantIds(tx, id);
    const trialists = await listTrialists(tx, memberIds);
    const valueMillions = awaiting.valueMillions ?? 0;

    const awards = generatePointSplit({
      nonClanCount: awaiting.nonClanCount,
      participants: memberIds.map((memberId) => ({ isTrialist: trialists.has(memberId), memberId })),
      valueMillions
    });

    const note = [awaiting.itemName, valueMillions, memberIds.length + awaiting.nonClanCount].join(",");
    await awardPoints(tx, awards, id, note);

    return "reviewed";
  });

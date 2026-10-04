import { db } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import { claimEarnedDiaryTiers } from "@/modules/members/service/shared/claim-earned-diary-tiers";

import { findPersonalBestAwaitingReview } from "../repository/find-personal-best-awaiting-review";
import { listParticipantIds } from "../repository/list-participant-ids";
import { reviewPersonalBest } from "../repository/review-personal-best";
import { payDiaryCarries } from "./shared/pay-diary-carries";

export type ReviewRequest = {
  reviewNote: string | null;
  reviewedBy: bigint;
  status: "approved" | "denied";
};

export type ReviewResult = "reviewed" | "not-awaiting-review";

/**
 * Approving a run earns no points for the run itself: the speedrun diary reads the times, so a
 * member's standing follows from the approval. What it can pay is a carry, to the members who
 * already held a tier the run has just given somebody else, and any diary tier the run pushes a
 * member's points over.
 */
export const reviewPersonalBestById = async (id: number, review: ReviewRequest): Promise<ReviewResult> =>
  db.transaction(async (tx) => {
    const awaiting = await findPersonalBestAwaitingReview(tx, id);
    if (!awaiting) return "not-awaiting-review";

    await reviewPersonalBest(tx, id, review);
    const memberIds = await listParticipantIds(tx, id);
    await recordAuditEntry(tx, {
      actingMemberId: review.reviewedBy,
      action: "personal_best_reviewed",
      affects: memberIds,
      note: `${review.status} personal best #${id}`,
      source: "server"
    });

    if (review.status === "denied" || awaiting.contentId === null) return "reviewed";

    await payDiaryCarries(tx, { ...awaiting, contentId: awaiting.contentId }, memberIds);
    await claimEarnedDiaryTiers(tx, memberIds);
    return "reviewed";
  });

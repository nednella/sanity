import { db } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import { claimEarnedDiaryTiers } from "@/modules/members/service/shared/claim-earned-diary-tiers";
import type { Review } from "@/schema/common";

import { personalBestErrors } from "../errors";
import { findPersonalBestForReview } from "../repository/find-personal-best-for-review";
import { listParticipantIds } from "../repository/list-participant-ids";
import { reviewPersonalBest } from "../repository/review-personal-best";
import { payDiaryCarries } from "./shared/pay-diary-carries";

/**
 * Approving a run earns no points for the run itself: the speedrun diary reads the times, so a
 * member's standing follows from the approval. What it can pay is a carry, to the members who
 * already held a tier the run has just given somebody else, and any diary tier the run pushes a
 * member's points over. A run reaches review once its submitter has confirmed it. Asking for the review
 * it already has changes nothing, and any other review of a pending or reviewed run is refused.
 */
export const reviewPersonalBestById = async (id: number, review: Review) =>
  db.transaction(async (tx) => {
    const personalBest = await findPersonalBestForReview(tx, id);
    if (!personalBest) throw personalBestErrors.notFound(id);
    if (personalBest.status === review.status) return;
    if (personalBest.status !== "submitted") throw personalBestErrors.notAwaitingReview(id);

    await reviewPersonalBest(tx, id, review);
    const memberIds = await listParticipantIds(tx, id);
    await recordAuditEntry(tx, {
      actingMemberId: review.reviewedBy,
      action: "personal_best_reviewed",
      affects: memberIds,
      note: `${review.status} personal best #${id}`,
      source: "server"
    });

    if (review.status === "denied" || personalBest.contentId === null) return;

    await payDiaryCarries(tx, { ...personalBest, contentId: personalBest.contentId }, memberIds, review.reviewedBy);
    await claimEarnedDiaryTiers(tx, memberIds, review.reviewedBy);
  });

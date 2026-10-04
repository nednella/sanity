import { db } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import { claimEarnedDiaryTiers } from "@/modules/members/service/shared/claim-earned-diary-tiers";
import { awardPoints } from "@/modules/points/repository/award-points";
import { generateDiaryCarryAwards } from "@/modules/points/rules";
import { getEliteAndMasterDiaryTimes } from "@/modules/speedrun-diary/repository/get-elite-and-master-diary-times";

import { findPersonalBestAwaitingReview } from "../repository/find-personal-best-awaiting-review";
import { listBestTimes } from "../repository/list-best-times";
import { listParticipantIds } from "../repository/list-participant-ids";
import { reviewPersonalBest } from "../repository/review-personal-best";

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

    const diaryTier = await getEliteAndMasterDiaryTimes(tx, awaiting.contentId, awaiting.scale);
    const personalBestsByMemberId = await listBestTimes(tx, {
      contentId: awaiting.contentId,
      excludeId: id,
      memberIds,
      scale: awaiting.scale
    });

    for (const tier of diaryTier) {
      if (awaiting.timeSeconds > tier.timeSeconds) continue;

      const hasDiaryTier = (memberId: bigint) =>
        (personalBestsByMemberId.get(memberId) ?? Infinity) <= tier.timeSeconds;

      const awards = generateDiaryCarryAwards({
        carried: memberIds.filter((memberId) => !hasDiaryTier(memberId)),
        holders: memberIds.filter((memberId) => hasDiaryTier(memberId)),
        tierId: tier.tierId
      });

      await awardPoints(tx, awards, null, `${tier.tierName.toLowerCase()} diary carry - pb #${id}`);
    }

    await claimEarnedDiaryTiers(tx, memberIds);
    return "reviewed";
  });

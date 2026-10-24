import { db } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import type { Actor } from "@/modules/auth/service/authenticate";
import { listTrialists } from "@/modules/members/repository/list-trialists";
import { awardPoints } from "@/modules/points/repository/award-points";
import { generatePointSplit } from "@/modules/points/rules";
import type { Review } from "@/schema/common";

import { submissionErrors } from "../errors";
import { findSubmissionForReview } from "../repository/find-submission-for-review";
import { listParticipantIds } from "../repository/list-participant-ids";
import { reviewSubmission } from "../repository/review-submission";

/**
 * Approving is what pays out, so the read of the submission, the points and the members' totals all
 * happen in one transaction, and the row is locked while it runs. A submission reaches review once its
 * submitter has confirmed it. Asking for the review it already has changes nothing, and any other review
 * of a pending or reviewed submission is refused, so it is never paid twice.
 */
export const reviewSubmissionById = async (id: number, review: Review, actor: Actor) =>
  db.transaction(async (tx) => {
    const submission = await findSubmissionForReview(tx, id);
    if (!submission) throw submissionErrors.notFound(id);
    if (submission.status === review.status) return;
    if (submission.status !== "submitted") throw submissionErrors.notAwaitingReview(id);

    await reviewSubmission(tx, id, review, actor.memberId);
    const memberIds = await listParticipantIds(tx, id);
    await recordAuditEntry(tx, {
      actingMemberId: actor.memberId,
      action: "submission_reviewed",
      affects: memberIds,
      note: `${review.status} drop submission #${id}`,
      source: actor.source
    });

    if (review.status === "denied") return;

    const trialists = await listTrialists(tx, memberIds);
    const valueMillions = submission.valueMillions ?? 0;

    const awards = generatePointSplit({
      nonClanCount: submission.nonClanCount,
      participants: memberIds.map((memberId) => ({ isTrialist: trialists.has(memberId), memberId })),
      valueMillions
    });

    const note = [submission.itemName, valueMillions, memberIds.length + submission.nonClanCount].join(",");
    await awardPoints(tx, awards, actor.memberId, id, note);
  });

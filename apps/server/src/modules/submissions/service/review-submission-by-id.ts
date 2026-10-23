import { db } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
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
 * submitter has confirmed it, so a pending or reviewed submission is refused rather than paid twice.
 */
export const reviewSubmissionById = async (id: number, review: Review) =>
  db.transaction(async (tx) => {
    const submission = await findSubmissionForReview(tx, id);
    if (!submission) throw submissionErrors.notFound(id);
    if (submission.status !== "submitted") throw submissionErrors.notAwaitingReview(id);

    await reviewSubmission(tx, id, review);
    const memberIds = await listParticipantIds(tx, id);
    await recordAuditEntry(tx, {
      actingMemberId: review.reviewedBy,
      action: "submission_reviewed",
      affects: memberIds,
      note: `${review.status} drop submission #${id}`,
      source: "server"
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
    await awardPoints(tx, awards, review.reviewedBy, id, note);
  });

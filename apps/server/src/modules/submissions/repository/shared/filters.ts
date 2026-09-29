import type { SQL } from "drizzle-orm";
import { and, eq, inArray } from "drizzle-orm";

import { db } from "@db/index";
import { submissionEvent, submissionParticipants, submissionStatus, submissions } from "@db/schema";

export type SubmissionFilters = {
  memberId?: bigint;
  event?: (typeof submissionEvent.enumValues)[number];
  status?: (typeof submissionStatus.enumValues)[number];
};

// Denied and deleted submissions stay hidden; everything else is either counted or waiting to be.
const isListed = inArray(submissions.status, ["approved", "approved_missing_member", "pending", "submitted"]);

// A submission reaches review once its submitter has confirmed it. A pending one is still theirs to
// finish, and a reviewed one is finished, so neither can be reviewed.
export const isAwaitingReview = eq(submissions.status, "submitted");

// Credit by team, the same way personal bests do: the submitter is often not who the drop belongs to.
const isCreditedTo = (memberId: bigint | undefined) =>
  memberId === undefined
    ? undefined
    : inArray(
        submissions.id,
        db
          .select({ id: submissionParticipants.submissionId })
          .from(submissionParticipants)
          .where(eq(submissionParticipants.memberId, memberId))
      );

export const matchesSubmission = ({ memberId, event, status }: SubmissionFilters): SQL | undefined =>
  and(
    isListed,
    isCreditedTo(memberId),
    event && eq(submissions.event, event),
    status && eq(submissions.status, status)
  );

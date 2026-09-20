import { and, desc, eq, inArray } from "drizzle-orm";

import { db } from "@db/index";
import { members, submissionEvent, submissionParticipants, submissions } from "@db/schema";

export type ListSubmissionsOptions = {
  limit: number;
  offset: number;
  memberId?: bigint;
  event?: (typeof submissionEvent.enumValues)[number];
};

const isApproved = inArray(submissions.status, ["approved", "approved_missing_member"]);

export const listSubmissions = ({ limit, offset, memberId, event }: ListSubmissionsOptions) => {
  const isCredited = memberId
    ? inArray(
        submissions.id,
        db
          .select({ id: submissionParticipants.submissionId })
          .from(submissionParticipants)
          .where(eq(submissionParticipants.memberId, memberId))
      )
    : undefined;

  return db
    .select({ submission: submissions, submittedBy: { id: members.id, displayName: members.displayName } })
    .from(submissions)
    .innerJoin(members, eq(members.id, submissions.memberId))
    .where(and(isApproved, isCredited, event && eq(submissions.event, event)))
    .orderBy(desc(submissions.submittedAt))
    .limit(limit)
    .offset(offset);
};

export type SubmissionRow = Awaited<ReturnType<typeof listSubmissions>>[number];

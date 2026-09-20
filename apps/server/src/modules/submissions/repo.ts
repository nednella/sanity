import { and, desc, eq, inArray } from "drizzle-orm";

import { db } from "../../../db/index";
import { members, points, submissionEvent, submissionParticipants, submissions } from "../../../db/schema";

type ListOptions = {
  limit: number;
  offset: number;
  memberId?: bigint;
  event?: (typeof submissionEvent.enumValues)[number];
};

const isApproved = inArray(submissions.status, ["approved", "approved_missing_member"]);

export const listSubmissions = ({ limit, offset, memberId, event }: ListOptions) => {
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

export const listParticipants = async (submissionIds: number[]) => {
  if (submissionIds.length === 0) return [];

  return db
    .select({
      submissionId: submissionParticipants.submissionId,
      id: members.id,
      displayName: members.displayName,
      points: points.value
    })
    .from(submissionParticipants)
    .innerJoin(members, eq(members.id, submissionParticipants.memberId))
    .leftJoin(
      points,
      and(
        eq(points.submissionId, submissionParticipants.submissionId),
        eq(points.memberId, submissionParticipants.memberId)
      )
    )
    .where(inArray(submissionParticipants.submissionId, submissionIds))
    .orderBy(desc(points.value));
};

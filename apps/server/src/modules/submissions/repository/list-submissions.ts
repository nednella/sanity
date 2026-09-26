import type { SQL } from "drizzle-orm";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

import { db } from "@db/index";
import { members, submissionEvent, submissionParticipants, submissions } from "@db/schema";

import type { SubmissionSort } from "../request";

export type SubmissionFilters = {
  memberId?: bigint;
  event?: (typeof submissionEvent.enumValues)[number];
};

export type ListSubmissionsOptions = SubmissionFilters & {
  limit: number;
  offset: number;
  order: "asc" | "desc";
  sort: SubmissionSort;
};

const sortColumns: Record<SubmissionSort, PgColumn> = {
  item: submissions.itemName,
  submittedAt: submissions.submittedAt,
  valueMillions: submissions.valueMillions
};

const isApproved = inArray(submissions.status, ["approved", "approved_missing_member"]);

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

export const matchesSubmission = ({ memberId, event }: SubmissionFilters): SQL | undefined =>
  and(isApproved, isCreditedTo(memberId), event && eq(submissions.event, event));

export const listSubmissions = ({ limit, offset, order, sort, ...filters }: ListSubmissionsOptions) => {
  const direction = order === "asc" ? asc : desc;

  return db
    .select({ submission: submissions, submittedBy: { id: members.id, displayName: members.displayName } })
    .from(submissions)
    .innerJoin(members, eq(members.id, submissions.memberId))
    .where(matchesSubmission(filters))
    .orderBy(direction(sortColumns[sort]), desc(submissions.id))
    .limit(limit)
    .offset(offset);
};

export type SubmissionRow = Awaited<ReturnType<typeof listSubmissions>>[number];

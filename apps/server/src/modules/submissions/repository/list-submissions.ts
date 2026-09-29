import { asc, desc, eq } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

import { db } from "@db/index";
import { items, members, submissions } from "@db/schema";

import type { SubmissionSort } from "../request";
import { type SubmissionFilters, matchesSubmission } from "./shared/filters";

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

export const listSubmissions = ({ limit, offset, order, sort, ...filters }: ListSubmissionsOptions) => {
  const direction = order === "asc" ? asc : desc;

  return db
    .select({
      submission: submissions,
      item: { name: items.name, osrsItemId: items.osrsItemId },
      submittedBy: { id: members.id, displayName: members.displayName }
    })
    .from(submissions)
    .innerJoin(members, eq(members.id, submissions.memberId))
    .leftJoin(items, eq(items.id, submissions.itemId))
    .where(matchesSubmission(filters))
    .orderBy(direction(sortColumns[sort]), desc(submissions.id))
    .limit(limit)
    .offset(offset);
};

export type SubmissionRow = Awaited<ReturnType<typeof listSubmissions>>[number];

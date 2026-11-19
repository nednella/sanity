import { desc, eq } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

import { db } from "@db/index";
import { items, members, submissions } from "@db/schema";

import { sortBy } from "@/utils/sql";

import type { SubmissionSort } from "../request";
import { type SubmissionFilters, matchesSubmission } from "./shared/filters";

export type SubmissionRow = Awaited<ReturnType<typeof listSubmissions>>[number];

const sortColumns: Record<SubmissionSort, PgColumn> = {
  item: submissions.itemName,
  submittedAt: submissions.submittedAt,
  valueMillions: submissions.valueMillions
};

export type ListSubmissionsOptions = SubmissionFilters & {
  limit: number;
  offset: number;
  order: "asc" | "desc";
  sort: SubmissionSort;
};

export function listSubmissions({ limit, offset, order, sort, ...filters }: ListSubmissionsOptions) {
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
    .orderBy(sortBy(sortColumns[sort], order), desc(submissions.id))
    .limit(limit)
    .offset(offset);
}

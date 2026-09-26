import { and, asc, desc } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

import { personalBests, speedrunContent } from "@db/schema";

import type { PersonalBestSort } from "../request";
import { type ContentFilters, isActiveContent, isFor, isInTeamOf, isPersonalBest } from "./shared/filters";
import { selectRanked } from "./shared/select-ranked";

export type ListMemberPersonalBestsOptions = ContentFilters & {
  limit: number;
  offset: number;
  order: "asc" | "desc";
  sort: PersonalBestSort;
  top?: number;
};

const sortColumns: Record<PersonalBestSort, PgColumn> = {
  content: speedrunContent.name,
  scale: personalBests.scale,
  submittedAt: personalBests.submittedAt,
  time: personalBests.time
};

// A run is only ever one member's best for a content and team size, so the sorted column decides the order
// on its own and content name breaks any tie.
const toOrderBy = (sort: PersonalBestSort, order: "asc" | "desc") => {
  const direction = order === "asc" ? asc : desc;
  return [direction(sortColumns[sort]), asc(speedrunContent.name), asc(personalBests.scale)];
};

export const listMemberPersonalBests = (
  memberId: bigint,
  { limit, offset, order, sort, top, ...filters }: ListMemberPersonalBestsOptions
) =>
  selectRanked(and(isPersonalBest, isInTeamOf(memberId), isActiveContent, isFor(filters)), top, toOrderBy(sort, order))
    .limit(limit)
    .offset(offset);

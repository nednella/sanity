import { asc } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

import { bosses, personalBests } from "@db/schema";

import { sortBy } from "@/utils/sql";

import type { PersonalBestSort } from "../request";
import { type PersonalBestFilters, matchesPersonalBest } from "./shared/filters";
import { selectRankedPersonalBests } from "./shared/select-ranked-personal-bests";

export type PersonalBestRow = Awaited<ReturnType<typeof listPersonalBests>>[number];

const sortColumns: Record<PersonalBestSort, PgColumn> = {
  content: bosses.name,
  scale: personalBests.scale,
  submittedAt: personalBests.submittedAt,
  time: personalBests.time
};

export type ListPersonalBestsOptions = PersonalBestFilters & {
  limit: number;
  offset: number;
  order: "asc" | "desc";
  sort: PersonalBestSort;
};

export function listPersonalBests({ limit, offset, order, sort, ...filters }: ListPersonalBestsOptions) {
  return selectRankedPersonalBests(matchesPersonalBest(filters), filters.top, toOrderBy(sort, order))
    .limit(limit)
    .offset(offset);
}

// A run is only ever one member's best for a content and team size, so the
// sorted column decides the order on its own and content name breaks any tie.
function toOrderBy(sort: PersonalBestSort, order: "asc" | "desc") {
  return [sortBy(sortColumns[sort], order), asc(bosses.name), asc(personalBests.scale)];
}

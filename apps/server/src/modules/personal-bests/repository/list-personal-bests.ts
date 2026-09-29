import { asc, desc } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

import { bosses, personalBests } from "@db/schema";

import type { PersonalBestSort } from "../request";
import type { PersonalBestFilters } from "./shared/filters";
import { isCandidate } from "./shared/filters";
import { selectRanked } from "./shared/select-ranked";

export type ListPersonalBestsOptions = PersonalBestFilters & {
  limit: number;
  offset: number;
  order: "asc" | "desc";
  sort: PersonalBestSort;
};

const sortColumns: Record<PersonalBestSort, PgColumn> = {
  content: bosses.name,
  scale: personalBests.scale,
  submittedAt: personalBests.submittedAt,
  time: personalBests.time
};

// A run is only ever one member's best for a content and team size, so the sorted column decides the order
// on its own and content name breaks any tie.
const toOrderBy = (sort: PersonalBestSort, order: "asc" | "desc") => {
  const direction = order === "asc" ? asc : desc;
  return [direction(sortColumns[sort]), asc(bosses.name), asc(personalBests.scale)];
};

export const listPersonalBests = ({ limit, offset, order, sort, ...filters }: ListPersonalBestsOptions) =>
  selectRanked(isCandidate(filters), filters.top, toOrderBy(sort, order)).limit(limit).offset(offset);

export type PersonalBestRow = Awaited<ReturnType<typeof listPersonalBests>>[number];

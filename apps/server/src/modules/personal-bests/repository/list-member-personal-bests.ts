import { and } from "drizzle-orm";

import { type ContentFilters, isActiveContent, isFor, isInTeamOf, isPersonalBest } from "./shared/filters";
import { selectRanked } from "./shared/select-ranked";

export type ListMemberPersonalBestsOptions = ContentFilters & {
  limit: number;
  offset: number;
  top?: number;
};

export const listMemberPersonalBests = (
  memberId: bigint,
  { limit, offset, top, ...filters }: ListMemberPersonalBestsOptions
) =>
  selectRanked(and(isPersonalBest, isInTeamOf(memberId), isActiveContent, isFor(filters)), top)
    .limit(limit)
    .offset(offset);

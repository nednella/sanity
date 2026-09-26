import { and, count } from "drizzle-orm";

import { db } from "@db/index";

import { type ContentFilters, isActiveContent, isFor, isInTeamOf, isPersonalBest } from "./shared/filters";
import { selectRanked } from "./shared/select-ranked";

export type CountMemberPersonalBestsOptions = ContentFilters & {
  top?: number;
};

// Counted through the same ranked selection the list uses, so a `top` filter narrows both alike.
export const countMemberPersonalBests = async (
  memberId: bigint,
  { top, ...filters }: CountMemberPersonalBestsOptions
) => {
  const ranked = selectRanked(and(isPersonalBest, isInTeamOf(memberId), isActiveContent, isFor(filters)), top).as(
    "member_personal_bests"
  );

  const [row] = await db.select({ value: count() }).from(ranked);
  return row?.value ?? 0;
};

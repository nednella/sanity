import { count } from "drizzle-orm";

import { db } from "@db/index";

import type { PersonalBestFilters } from "./shared/filters";
import { isCandidate } from "./shared/filters";
import { selectRanked } from "./shared/select-ranked";

// Counted through the same ranked selection the list uses, so a `top` filter narrows both alike.
export const countPersonalBests = async (filters: PersonalBestFilters) => {
  const ranked = selectRanked(isCandidate(filters), filters.top).as("personal_bests");

  const [row] = await db.select({ value: count() }).from(ranked);
  return row?.value ?? 0;
};

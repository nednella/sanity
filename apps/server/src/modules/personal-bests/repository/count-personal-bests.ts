import { count } from "drizzle-orm";

import { db } from "@db/index";

import { type PersonalBestFilters, matchesPersonalBest } from "./shared/filters";
import { selectRanked } from "./shared/select-ranked";

// Counted through the same ranked selection the list uses, so a `top` filter narrows both alike.
export async function countPersonalBests(filters: PersonalBestFilters) {
  const ranked = selectRanked(matchesPersonalBest(filters), filters.top).as("personal_bests");

  const [row] = await db.select({ value: count() }).from(ranked);
  return row?.value ?? 0;
}

import type { SQL } from "drizzle-orm";
import { asc, eq, lte, sql } from "drizzle-orm";

import { db } from "@db/index";
import { members, personalBests, speedrunContent } from "@db/schema";

import { columns } from "./columns";

// Ranks the matching runs within each content and team size, fastest first and the earlier submission winning a
// tie, then keeps the top of each when a limit is given.
export const selectRanked = (isCandidate: SQL | undefined, top: number | undefined, orderBy?: SQL[]) => {
  const ranked = db.$with("ranked").as(
    db
      .select({
        id: personalBests.id,
        position: sql<number>`row_number() over (
          partition by ${personalBests.contentId}, ${personalBests.scale}
          order by ${personalBests.time}, ${personalBests.submittedAt}
        )`
          .mapWith(Number)
          .as("position")
      })
      .from(personalBests)
      .where(isCandidate)
  );

  return db
    .with(ranked)
    .select({ ...columns, position: ranked.position })
    .from(personalBests)
    .innerJoin(ranked, eq(ranked.id, personalBests.id))
    .innerJoin(speedrunContent, eq(speedrunContent.id, personalBests.contentId))
    .innerJoin(members, eq(members.id, personalBests.memberId))
    .where(top === undefined ? undefined : lte(ranked.position, top))
    .orderBy(...(orderBy ?? [asc(speedrunContent.name), asc(personalBests.scale), asc(ranked.position)]));
};

import { type SQL, and, asc, eq, lte, sql } from "drizzle-orm";

import { db } from "@db/index";
import { bosses, members, personalBests, speedrunContent } from "@db/schema";

import { columns } from "./columns";
import { isActiveContent, isClanRecord } from "./filters";

// Ranks every run eligible to be a clan record within its content and team size, fastest first and the
// earlier submission winning a tie. A run whose team is incomplete is not eligible, so it comes back
// without a rank rather than displacing the runs that are.
export const selectRanked = (matches: SQL | undefined, top: number | undefined, orderBy?: SQL[]) => {
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
      .where(and(isClanRecord, isActiveContent))
  );

  return db
    .with(ranked)
    .select({ ...columns, position: ranked.position })
    .from(personalBests)
    .leftJoin(ranked, eq(ranked.id, personalBests.id))
    .innerJoin(speedrunContent, eq(speedrunContent.id, personalBests.contentId))
    .innerJoin(bosses, eq(bosses.id, speedrunContent.bossId))
    .innerJoin(members, eq(members.id, personalBests.memberId))
    .where(top === undefined ? matches : and(matches, lte(ranked.position, top)))
    .orderBy(...(orderBy ?? [asc(bosses.name), asc(personalBests.scale), asc(ranked.position)]));
};

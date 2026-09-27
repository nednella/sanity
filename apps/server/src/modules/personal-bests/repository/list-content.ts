import { asc, eq, sql } from "drizzle-orm";

import { db } from "@db/index";
import { bosses, speedrunContent, speedrunDiaryTimes } from "@db/schema";

// The diary sets a time for each content and team size it rewards, and those are the only ones
// worth filtering by: plain Chambers of Xeric has runs but no diary, so it is not one.
export const listContent = () =>
  db
    .select({
      id: speedrunContent.id,
      name: bosses.name,
      metric: bosses.womMetric,
      scales: sql<number[]>`array_agg(distinct ${speedrunDiaryTimes.scale} order by ${speedrunDiaryTimes.scale})`
    })
    .from(speedrunDiaryTimes)
    .innerJoin(speedrunContent, eq(speedrunContent.id, speedrunDiaryTimes.contentId))
    .innerJoin(bosses, eq(bosses.id, speedrunContent.bossId))
    .where(eq(speedrunContent.isActive, true))
    .groupBy(speedrunContent.id, bosses.name, bosses.womMetric)
    .orderBy(asc(bosses.name));

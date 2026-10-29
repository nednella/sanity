import { asc, eq } from "drizzle-orm";

import { db } from "@db/index";
import { bosses, speedrunContent, speedrunDiaryTiers, speedrunDiaryTimes } from "@db/schema";

import { epochSeconds } from "@/utils/sql";

// Every threshold the diary sets: one row per content, team size and tier.
export function listDiaryTimes() {
  return db
    .select({
      contentId: speedrunContent.id,
      contentName: bosses.name,
      contentMetric: bosses.womMetric,
      contentImageUrl: speedrunContent.imageUrl,
      scale: speedrunDiaryTimes.scale,
      tierId: speedrunDiaryTiers.id,
      tierName: speedrunDiaryTiers.name,
      tierPoints: speedrunDiaryTiers.points,
      timeSeconds: epochSeconds(speedrunDiaryTimes.time)
    })
    .from(speedrunDiaryTimes)
    .innerJoin(speedrunContent, eq(speedrunContent.id, speedrunDiaryTimes.contentId))
    .innerJoin(bosses, eq(bosses.id, speedrunContent.bossId))
    .innerJoin(speedrunDiaryTiers, eq(speedrunDiaryTiers.id, speedrunDiaryTimes.tierId))
    .orderBy(asc(bosses.name), asc(speedrunDiaryTimes.scale), asc(speedrunDiaryTiers.id));
}

export type DiaryTimeRow = Awaited<ReturnType<typeof listDiaryTimes>>[number];

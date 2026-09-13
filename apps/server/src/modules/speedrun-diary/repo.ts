import { and, eq, inArray, lte, max, sql, sum } from "drizzle-orm";

import { db } from "../../../db/index.js";
import { personalBestParticipants, personalBests, speedrunDiaryTiers, speedrunDiaryTimes } from "../../../db/schema.js";

// Diary progress is derived, never stored: each member's best approved time per diary earns every tier it
// beats, so a changed threshold applies on the next read.
export const listDiaryProgress = async (memberIds: bigint[]) => {
  if (memberIds.length === 0) return [];

  const isApproved = inArray(personalBests.status, ["approved", "approved_missing_member"]);
  const isRequested = inArray(personalBestParticipants.memberId, memberIds);

  const bestTimes = db.$with("best_times").as(
    db
      .select({
        memberId: personalBestParticipants.memberId,
        contentId: personalBests.contentId,
        scale: personalBests.scale,
        bestTime: sql<string>`min(${personalBests.time})`.as("best_time")
      })
      .from(personalBests)
      .innerJoin(personalBestParticipants, eq(personalBestParticipants.personalBestId, personalBests.id))
      .where(and(isApproved, isRequested))
      .groupBy(personalBestParticipants.memberId, personalBests.contentId, personalBests.scale)
  );

  const isBeaten = and(
    eq(speedrunDiaryTimes.contentId, bestTimes.contentId),
    eq(speedrunDiaryTimes.scale, bestTimes.scale),
    lte(bestTimes.bestTime, speedrunDiaryTimes.time)
  );

  const reachedTiers = db.$with("reached_tiers").as(
    db
      .select({ memberId: bestTimes.memberId, tierId: max(speedrunDiaryTimes.tierId).as("reached_tier_id") })
      .from(bestTimes)
      .innerJoin(speedrunDiaryTimes, isBeaten)
      .groupBy(bestTimes.memberId, bestTimes.contentId, bestTimes.scale)
  );

  const topTierId = db.select({ id: max(speedrunDiaryTiers.id) }).from(speedrunDiaryTiers);

  return db
    .with(bestTimes, reachedTiers)
    .select({
      memberId: reachedTiers.memberId,
      diaryPoints: sum(speedrunDiaryTiers.points).mapWith(Number),
      masterDiaries: sql<number>`count(*) filter (where ${speedrunDiaryTiers.id} = (${topTierId}))`.mapWith(Number)
    })
    .from(reachedTiers)
    .innerJoin(speedrunDiaryTiers, lte(speedrunDiaryTiers.id, reachedTiers.tierId))
    .groupBy(reachedTiers.memberId);
};

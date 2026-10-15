import { and, eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { bosses, speedrunContent, speedrunDiaryTiers, speedrunDiaryTimes } from "@db/schema";

import { epochSeconds } from "@/utils/sql";

export type DiaryTimeKey = {
  contentId: number;
  scale: number;
  tierId: number;
};

export const updateDiaryTime = async (
  tx: Transaction,
  { contentId, scale, tierId }: DiaryTimeKey,
  timeSeconds: number
) => {
  const matchesKey = and(
    eq(speedrunDiaryTimes.contentId, contentId),
    eq(speedrunDiaryTimes.scale, scale),
    eq(speedrunDiaryTimes.tierId, tierId)
  );

  const [threshold] = await tx
    .select({
      contentName: bosses.name,
      tierName: speedrunDiaryTiers.name,
      timeSeconds: epochSeconds(speedrunDiaryTimes.time)
    })
    .from(speedrunDiaryTimes)
    .innerJoin(speedrunContent, eq(speedrunContent.id, speedrunDiaryTimes.contentId))
    .innerJoin(bosses, eq(bosses.id, speedrunContent.bossId))
    .innerJoin(speedrunDiaryTiers, eq(speedrunDiaryTiers.id, speedrunDiaryTimes.tierId))
    .where(matchesKey);
  if (!threshold) return;

  await tx
    .update(speedrunDiaryTimes)
    .set({ time: `${timeSeconds} seconds` })
    .where(matchesKey);

  return threshold;
};

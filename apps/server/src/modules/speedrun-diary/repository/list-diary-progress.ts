import { db } from "@db/index";

import { diaryProgressCte } from "./diary-progress-cte";

export const listDiaryProgress = async (memberIds: bigint[]) => {
  if (memberIds.length === 0) return [];

  const { bestTimes, reachedTiers, diaryProgress } = diaryProgressCte(memberIds);
  return db.with(bestTimes, reachedTiers, diaryProgress).select().from(diaryProgress);
};

export type DiaryProgressRow = Awaited<ReturnType<typeof listDiaryProgress>>[number];

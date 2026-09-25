import { toMemberDiary } from "../mapper";
import type { DiaryTimeRow } from "../repository/list-diary-times";
import { listDiaryTimes } from "../repository/list-diary-times";
import { listMemberBestTimes } from "../repository/list-member-best-times";

const keyOf = ({ contentId, scale }: { contentId: number; scale: number }) => `${contentId}:${scale}`;

/**
 * Every diary the clan tracks, whether or not the member has a time on it.
 */
export const getMemberDiaries = async (memberId: bigint) => {
  const [times, bestTimes] = await Promise.all([listDiaryTimes(), listMemberBestTimes(memberId)]);

  const bestFor = new Map(bestTimes.map((row) => [keyOf(row), row.timeSeconds]));
  const thresholds = new Map<string, [DiaryTimeRow, ...DiaryTimeRow[]]>();

  for (const time of times) {
    const key = keyOf(time);
    const current = thresholds.get(key);
    thresholds.set(key, current ? [...current, time] : [time]);
  }

  return [...thresholds].map(([key, rows]) => toMemberDiary(rows, bestFor.get(key) ?? null));
};

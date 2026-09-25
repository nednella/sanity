import type { DiaryTimeRow } from "./repository/list-diary-times";

const toTier = ({ tierId, tierName, tierPoints }: DiaryTimeRow) => ({
  id: tierId,
  name: tierName,
  points: tierPoints
});

/**
 * Turns one diary's thresholds into the member's standing on it.
 *
 * Thresholds arrive ordered by tier, and a faster time beats every tier below it, so the last one the
 * member's best beats is the tier they hold and the one after it is what they are chasing.
 */
export const toMemberDiary = ([first, ...rest]: [DiaryTimeRow, ...DiaryTimeRow[]], timeSeconds: number | null) => {
  const { contentId, contentName, contentImageUrl, scale } = first;
  const thresholds = [first, ...rest];

  const beaten = timeSeconds === null ? [] : thresholds.filter((threshold) => timeSeconds <= threshold.timeSeconds);
  const reached = beaten.at(-1);
  const next = thresholds.find((threshold) => !beaten.includes(threshold));

  return {
    content: {
      id: contentId,
      name: contentName,
      imageUrl: contentImageUrl
    },
    scale,
    timeSeconds,
    tier: reached ? toTier(reached) : null,
    nextTier: next ? { ...toTier(next), timeSeconds: next.timeSeconds } : null
  };
};

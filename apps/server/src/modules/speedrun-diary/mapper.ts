import type { DiaryTimeRow } from "./repository/list-diary-times";
import type { MemberBestTimeRow } from "./repository/list-member-best-times";

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
export const toMemberDiary = (
  [first, ...rest]: [DiaryTimeRow, ...DiaryTimeRow[]],
  pb: MemberBestTimeRow | undefined
) => {
  const { contentId, contentName, contentImageUrl, scale } = first;
  const thresholds = [first, ...rest];

  const beaten = pb ? thresholds.filter((threshold) => pb.timeSeconds <= threshold.timeSeconds) : [];
  const reached = beaten.at(-1);
  const next = thresholds.find((threshold) => !beaten.includes(threshold));

  return {
    content: {
      id: contentId,
      name: contentName,
      imageUrl: contentImageUrl
    },
    scale,
    pb: pb ? { id: pb.id, timeSeconds: pb.timeSeconds, imageUrl: pb.imageUrl } : null,
    tier: reached ? toTier(reached) : null,
    nextTier: next ? { ...toTier(next), timeSeconds: next.timeSeconds } : null
  };
};

const POINT_CAP = 250;
const TRIAL_MULTIPLIER = 2;

export type Participant = {
  isTrialist: boolean;
  memberId: bigint;
};

export type SubmissionSplit = {
  nonClanCount: number;
  participants: Participant[];
  valueMillions: number;
};

export type PointAward = {
  memberId: bigint;
  points: number;
};

/**
 * A drop is worth a point per million, split by head count and including the people on it who are
 * not in the clan, and each share is capped. Teaming with a trialist pays the members double, which
 * is the point of it; the trialist only doubles their own share when another trialist is with them.
 */
export const generatePointSplit = ({ nonClanCount, participants, valueMillions }: SubmissionSplit): PointAward[] => {
  const headCount = participants.length + nonClanCount;
  if (headCount === 0) return [];

  const share = Math.ceil(valueMillions / headCount);
  const trialistCount = participants.filter(({ isTrialist }) => isTrialist).length;

  return participants.map(({ isTrialist, memberId }) => {
    const isDoubled = trialistCount > (isTrialist ? 1 : 0);

    return { memberId, points: Math.min(POINT_CAP, share * (isDoubled ? TRIAL_MULTIPLIER : 1)) };
  });
};

import { ELITE_TIER_ID, MASTER_TIER_ID } from "@/modules/speedrun-diary/constants";

const POINT_CAP = 250;
const TRIAL_MULTIPLIER = 2;

const DIARY_CARRY_POINTS: Record<number, number> = { [ELITE_TIER_ID]: 25, [MASTER_TIER_ID]: 50 };

export type DiaryCarry = {
  carried: bigint[];
  holders: bigint[];
  tierId: number;
};

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

/**
 * Carrying somebody into a diary tier pays the members who already held it, once per person they
 * carried. Elite and master are counted apart, since a run can clear both and a teammate may hold
 * one without the other. A first clear for the whole team pays nobody: there was no one to carry.
 */
export const generateDiaryCarryAwards = ({ carried, holders, tierId }: DiaryCarry): PointAward[] => {
  const points = (DIARY_CARRY_POINTS[tierId] ?? 0) * carried.length;
  if (points === 0) return [];

  return holders.map((memberId) => ({ memberId, points }));
};

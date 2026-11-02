import { ELITE_TIER_ID, MASTER_TIER_ID } from "@/modules/speedrun-diary/constants";

const POINT_CAP = 250;
const TRIAL_MULTIPLIER = 2;

const DIARY_CARRY_POINTS: Record<number, number> = { [ELITE_TIER_ID]: 25, [MASTER_TIER_ID]: 50 };

export type DiaryCarry = {
  carried: bigint[];
  holders: bigint[];
  multiplier: number;
  tierId: number;
};

export type Participant = {
  isTrialist: boolean;
  memberId: bigint;
};

export type SubmissionSplit = {
  multiplier: number;
  nonClanCount: number;
  participants: Participant[];
  valueMillions: number;
};

export type PointAward = {
  memberId: bigint;
  points: number;
};

// The multiplier is read in hundredths, because 10 * 1.1 is 11.000000000000002 and rounding up would pay 12.
function applyMultiplier(points: number, multiplier: number) {
  const hundredths = Math.round(multiplier * 100);
  return Math.ceil((points * hundredths) / 100);
}

/**
 * A drop is worth a point per million, split by head count and including the people on it who are
 * not in the clan, and each share is capped. Teaming with a trialist pays the members double, which
 * is the point of it; the trialist only doubles their own share when another trialist is with them. A
 * bonus multiplier raises each member's points after that, rounding up, so one member's buff pays the
 * whole team and the drop keeps its real value.
 */
export function generatePointSplit({
  multiplier,
  nonClanCount,
  participants,
  valueMillions
}: SubmissionSplit): PointAward[] {
  const headCount = participants.length + nonClanCount;
  if (headCount === 0) return [];

  const share = Math.ceil(valueMillions / headCount);
  const trialistCount = participants.filter(({ isTrialist }) => isTrialist).length;

  return participants.map(({ isTrialist, memberId }) => {
    const isDoubled = trialistCount > (isTrialist ? 1 : 0);

    const points = applyMultiplier(share * (isDoubled ? TRIAL_MULTIPLIER : 1), multiplier);

    return { memberId, points: Math.min(POINT_CAP, points) };
  });
}

/**
 * Carrying somebody into a diary tier pays the members who already held it, once per person they
 * carried. Elite and master are counted apart, since a run can clear both and a teammate may hold
 * one without the other. A first clear for the whole team pays nobody: there was no one to carry. A
 * bonus multiplier raises the carry the same way it raises a drop.
 */
export function generateDiaryCarryAwards({ carried, holders, multiplier, tierId }: DiaryCarry): PointAward[] {
  const points = applyMultiplier((DIARY_CARRY_POINTS[tierId] ?? 0) * carried.length, multiplier);
  if (points === 0) return [];

  return holders.map((memberId) => ({ memberId, points }));
}

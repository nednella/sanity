import { describe, expect, it } from "vitest";

import { ELITE_TIER_ID } from "@/modules/speedrun-diary/constants";

import { generateDiaryCarryAwards, generatePointSplit } from "./rules";

const member = (memberId: bigint, isTrialist = false) => ({ isTrialist, memberId });

describe("generatePointSplit", () => {
  it("splits the drop by head count when no multiplier is live", () => {
    const awards = generatePointSplit({
      multiplier: 1,
      nonClanCount: 1,
      participants: [member(1n), member(2n)],
      valueMillions: 30
    });

    expect(awards).toEqual([
      { memberId: 1n, points: 10 },
      { memberId: 2n, points: 10 }
    ]);
  });

  it("raises each member's points after the split", () => {
    const awards = generatePointSplit({
      multiplier: 1.5,
      nonClanCount: 0,
      participants: [member(1n), member(2n), member(3n), member(4n)],
      valueMillions: 325
    });

    expect(awards.map(({ points }) => points)).toEqual([123, 123, 123, 123]);
  });

  it("rounds the raised points up", () => {
    const [award] = generatePointSplit({
      multiplier: 1.1,
      nonClanCount: 0,
      participants: [member(1n)],
      valueMillions: 21
    });

    expect(award?.points).toBe(24);
  });

  it("does not round up a whole number that floating point makes inexact", () => {
    const [award] = generatePointSplit({
      multiplier: 1.1,
      nonClanCount: 0,
      participants: [member(1n)],
      valueMillions: 10
    });

    expect(award?.points).toBe(11);
  });

  it("applies the multiplier on top of the trialist double", () => {
    const awards = generatePointSplit({
      multiplier: 1.5,
      nonClanCount: 0,
      participants: [member(1n), member(2n, true)],
      valueMillions: 40
    });

    expect(awards).toEqual([
      { memberId: 1n, points: 60 },
      { memberId: 2n, points: 30 }
    ]);
  });

  it("caps each share at 250 after every multiplier", () => {
    const awards = generatePointSplit({
      multiplier: 2,
      nonClanCount: 0,
      participants: [member(1n), member(2n, true)],
      valueMillions: 200
    });

    expect(awards).toEqual([
      { memberId: 1n, points: 250 },
      { memberId: 2n, points: 200 }
    ]);
  });
});

describe("generateDiaryCarryAwards", () => {
  it("pays each holder per member carried", () => {
    const awards = generateDiaryCarryAwards({
      carried: [3n, 4n],
      holders: [1n, 2n],
      multiplier: 1,
      tierId: ELITE_TIER_ID
    });

    expect(awards).toEqual([
      { memberId: 1n, points: 50 },
      { memberId: 2n, points: 50 }
    ]);
  });

  it("raises the carry by the multiplier, rounding up", () => {
    const [award] = generateDiaryCarryAwards({
      carried: [2n],
      holders: [1n],
      multiplier: 1.1,
      tierId: ELITE_TIER_ID
    });

    expect(award?.points).toBe(28);
  });
});

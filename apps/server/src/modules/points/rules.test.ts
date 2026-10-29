import { describe, expect, it } from "vitest";

import { generatePointSplit } from "./rules";

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

  it("raises the whole drop before the split", () => {
    const awards = generatePointSplit({
      multiplier: 1.5,
      nonClanCount: 0,
      participants: [member(1n), member(2n)],
      valueMillions: 25
    });

    expect(awards).toEqual([
      { memberId: 1n, points: 19 },
      { memberId: 2n, points: 19 }
    ]);
  });

  it("applies the trialist double on top of the multiplier", () => {
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

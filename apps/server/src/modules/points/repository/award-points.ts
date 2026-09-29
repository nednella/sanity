import { eq, sql } from "drizzle-orm";

import type { Queryable } from "@db/index";
import { members, points } from "@db/schema";

export type Award = {
  memberId: bigint;
  points: number;
};

export const awardPoints = async (tx: Queryable, awards: Award[], submissionId: number | null, notes: string) => {
  const earned = awards.filter(({ points: value }) => value > 0);
  if (earned.length === 0) return 0;

  await tx.insert(points).values(
    earned.map(({ memberId, points: value }) => ({
      awardedAt: new Date(),
      memberId,
      notes,
      submissionId,
      value
    }))
  );

  for (const { memberId, points: value } of earned) {
    await tx
      .update(members)
      .set({ clanPoints: sql`${members.clanPoints} + ${value}` })
      .where(eq(members.id, memberId));
  }

  return earned.length;
};

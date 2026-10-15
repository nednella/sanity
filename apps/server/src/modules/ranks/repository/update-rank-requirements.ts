import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { ranks } from "@db/schema";

export type RankRequirements = {
  clanPoints: number;
  diaryPoints: number;
  masterDiaries: number;
};

export const updateRankRequirements = async (
  tx: Transaction,
  rankId: number,
  { clanPoints, diaryPoints, masterDiaries }: RankRequirements
) => {
  const [rank] = await tx.select().from(ranks).where(eq(ranks.id, rankId));
  if (!rank) return;

  await tx
    .update(ranks)
    .set({
      clanPointRequirement: clanPoints,
      diaryPointRequirement: diaryPoints,
      masterDiaryRequirement: masterDiaries
    })
    .where(eq(ranks.id, rankId));

  return rank;
};

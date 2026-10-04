import { asc, eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { speedrunDiaryRewards, speedrunDiaryTiers } from "@db/schema";

export const listDiaryRewards = (tx: Transaction) =>
  tx
    .select({
      clanPoints: speedrunDiaryRewards.clanPoints,
      requiredDiaryPoints: speedrunDiaryRewards.requiredDiaryPoints,
      tierId: speedrunDiaryRewards.tierId,
      tierName: speedrunDiaryTiers.name
    })
    .from(speedrunDiaryRewards)
    .innerJoin(speedrunDiaryTiers, eq(speedrunDiaryTiers.id, speedrunDiaryRewards.tierId))
    .orderBy(asc(speedrunDiaryRewards.tierId));

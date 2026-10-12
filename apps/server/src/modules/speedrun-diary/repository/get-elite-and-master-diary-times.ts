import { and, eq, inArray } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { speedrunDiaryTiers, speedrunDiaryTimes } from "@db/schema";

import { epochSeconds } from "@/utils/sql";

import { ELITE_TIER_ID, MASTER_TIER_ID } from "../constants";

// The two tiers a carry pays for, with the time each demands of one content and team size.
export const getEliteAndMasterDiaryTimes = (tx: Transaction, contentId: number, scale: number) =>
  tx
    .select({
      tierId: speedrunDiaryTimes.tierId,
      tierName: speedrunDiaryTiers.name,
      timeSeconds: epochSeconds(speedrunDiaryTimes.time)
    })
    .from(speedrunDiaryTimes)
    .innerJoin(speedrunDiaryTiers, eq(speedrunDiaryTiers.id, speedrunDiaryTimes.tierId))
    .where(
      and(
        eq(speedrunDiaryTimes.contentId, contentId),
        eq(speedrunDiaryTimes.scale, scale),
        inArray(speedrunDiaryTimes.tierId, [ELITE_TIER_ID, MASTER_TIER_ID])
      )
    );

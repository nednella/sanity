import { and, eq, inArray, min, ne } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { personalBestParticipants, personalBests } from "@db/schema";

import { epochSeconds } from "@/utils/sql";

import { isApprovedRun } from "./shared/filters";

export type BestTimesOptions = {
  contentId: number;
  excludeId: number;
  memberIds: bigint[];
  scale: number;
};

/**
 * What each of these members had already run this content and team size in, before the run under
 * review. Every tier is decided against the same times, so they are read once rather than per tier.
 */
export async function listBestTimes(tx: Transaction, { contentId, excludeId, memberIds, scale }: BestTimesOptions) {
  if (memberIds.length === 0) return new Map<bigint, number>();

  const rows = await tx
    .select({
      memberId: personalBestParticipants.memberId,
      timeSeconds: epochSeconds(min(personalBests.time))
    })
    .from(personalBests)
    .innerJoin(personalBestParticipants, eq(personalBestParticipants.personalBestId, personalBests.id))
    .where(
      and(
        isApprovedRun,
        eq(personalBests.contentId, contentId),
        eq(personalBests.scale, scale),
        ne(personalBests.id, excludeId),
        inArray(personalBestParticipants.memberId, memberIds)
      )
    )
    .groupBy(personalBestParticipants.memberId);

  return new Map(rows.map(({ memberId, timeSeconds }) => [memberId, timeSeconds]));
}

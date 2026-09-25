import { and, eq, inArray, min, sql } from "drizzle-orm";

import { db } from "@db/index";
import { personalBestParticipants, personalBests } from "@db/schema";

// Credited by team, matching how the diary itself is scored.
export const listMemberBestTimes = (memberId: bigint) =>
  db
    .select({
      contentId: personalBests.contentId,
      scale: personalBests.scale,
      timeSeconds: sql<number>`extract(epoch from ${min(personalBests.time)})::float8`
    })
    .from(personalBests)
    .innerJoin(personalBestParticipants, eq(personalBestParticipants.personalBestId, personalBests.id))
    .where(
      and(
        inArray(personalBests.status, ["approved", "approved_missing_member"]),
        eq(personalBestParticipants.memberId, memberId)
      )
    )
    .groupBy(personalBests.contentId, personalBests.scale);

export type MemberBestTimeRow = Awaited<ReturnType<typeof listMemberBestTimes>>[number];

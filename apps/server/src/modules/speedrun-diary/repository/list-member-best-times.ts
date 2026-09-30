import { and, asc, eq, sql } from "drizzle-orm";

import { db } from "@db/index";
import { personalBestParticipants, personalBests } from "@db/schema";

import { isApprovedRun } from "@/modules/personal-bests/repository/shared/filters";

// Credited by team, matching how the diary itself is scored. The whole run comes back rather than its time
// alone, so the screenshot that proves it is one field away.
export const listMemberBestTimes = (memberId: bigint) =>
  db
    .selectDistinctOn([personalBests.contentId, personalBests.scale], {
      id: personalBests.id,
      contentId: personalBests.contentId,
      scale: personalBests.scale,
      timeSeconds: sql<number>`extract(epoch from ${personalBests.time})::float8`,
      imageUrl: personalBests.imageUrl
    })
    .from(personalBests)
    .innerJoin(personalBestParticipants, eq(personalBestParticipants.personalBestId, personalBests.id))
    .where(and(isApprovedRun, eq(personalBestParticipants.memberId, memberId)))
    .orderBy(asc(personalBests.contentId), asc(personalBests.scale), asc(personalBests.time), asc(personalBests.id));

export type MemberBestTimeRow = Awaited<ReturnType<typeof listMemberBestTimes>>[number];

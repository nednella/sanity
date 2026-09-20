import { asc, eq, inArray } from "drizzle-orm";

import { db } from "@db/index";
import { members, personalBestParticipants } from "@db/schema";

export const listTeams = async (personalBestIds: number[]) => {
  if (personalBestIds.length === 0) return [];

  return db
    .select({
      personalBestId: personalBestParticipants.personalBestId,
      id: members.id,
      displayName: members.displayName
    })
    .from(personalBestParticipants)
    .innerJoin(members, eq(members.id, personalBestParticipants.memberId))
    .where(inArray(personalBestParticipants.personalBestId, personalBestIds))
    .orderBy(asc(members.displayName));
};

export type TeamRow = Awaited<ReturnType<typeof listTeams>>[number];

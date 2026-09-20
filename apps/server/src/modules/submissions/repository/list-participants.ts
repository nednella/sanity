import { and, desc, eq, inArray } from "drizzle-orm";

import { db } from "@db/index";
import { members, points, submissionParticipants } from "@db/schema";

export const listParticipants = async (submissionIds: number[]) => {
  if (submissionIds.length === 0) return [];

  return db
    .select({
      submissionId: submissionParticipants.submissionId,
      id: members.id,
      displayName: members.displayName,
      points: points.value
    })
    .from(submissionParticipants)
    .innerJoin(members, eq(members.id, submissionParticipants.memberId))
    .leftJoin(
      points,
      and(
        eq(points.submissionId, submissionParticipants.submissionId),
        eq(points.memberId, submissionParticipants.memberId)
      )
    )
    .where(inArray(submissionParticipants.submissionId, submissionIds))
    .orderBy(desc(points.value));
};

export type ParticipantRow = Awaited<ReturnType<typeof listParticipants>>[number];

import { eq } from "drizzle-orm";

import type { Queryable } from "@db/index";
import { submissionParticipants } from "@db/schema";

export const listParticipantIds = async (tx: Queryable, submissionId: number) => {
  const rows = await tx
    .select({ memberId: submissionParticipants.memberId })
    .from(submissionParticipants)
    .where(eq(submissionParticipants.submissionId, submissionId));

  return rows.map(({ memberId }) => memberId);
};

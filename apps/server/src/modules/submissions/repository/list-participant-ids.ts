import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { submissionParticipants } from "@db/schema";

export async function listParticipantIds(tx: Transaction, submissionId: number) {
  const rows = await tx
    .select({ memberId: submissionParticipants.memberId })
    .from(submissionParticipants)
    .where(eq(submissionParticipants.submissionId, submissionId));

  return rows.map(({ memberId }) => memberId);
}

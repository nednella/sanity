import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { submissions } from "@db/schema";

import type { Review } from "@/schema/common";

// Only a submission still waiting can be reviewed, so a second approval cannot pay out twice.
export async function reviewSubmission(tx: Transaction, id: number, review: Review, reviewedBy: bigint) {
  const reviewed = await tx
    .update(submissions)
    .set({ ...review, reviewedAt: new Date(), reviewedBy })
    .where(eq(submissions.id, id))
    .returning({ id: submissions.id });

  return reviewed.length > 0;
}

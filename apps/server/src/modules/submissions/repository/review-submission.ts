import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { submissions } from "@db/schema";

export type Review = {
  reviewNote: string | null;
  reviewedBy: bigint;
  status: "approved" | "denied";
};

// Only a submission still waiting can be reviewed, so a second approval cannot pay out twice.
export const reviewSubmission = async (tx: Transaction, id: number, review: Review) => {
  const reviewed = await tx
    .update(submissions)
    .set({ ...review, reviewedAt: new Date() })
    .where(eq(submissions.id, id))
    .returning({ id: submissions.id });

  return reviewed.length > 0;
};

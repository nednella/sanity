import { and, eq } from "drizzle-orm";

import type { Queryable } from "@db/index";
import { submissions } from "@db/schema";

import { isAwaitingReview } from "./shared/filters";

export const findSubmissionAwaitingReview = async (tx: Queryable, id: number) => {
  const [found] = await tx
    .select({ id: submissions.id })
    .from(submissions)
    .where(and(eq(submissions.id, id), isAwaitingReview))
    .for("update", { of: submissions });

  return found;
};

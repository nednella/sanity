import { db } from "@db/index";

import type { Actor } from "@/modules/auth/service/authenticate";

import { type SubmissionRow, saveSubmission } from "../repository/save-submission";

export type NewSubmission = Omit<SubmissionRow, "memberId" | "status" | "submittedAt"> & { participants: bigint[] };

// A submission arrives waiting for review. Nothing it claims is trusted until someone approves it,
// and no points exist until then.
export const createSubmission = async ({ participants, ...submission }: NewSubmission, actor: Actor) =>
  db.transaction(async (tx) =>
    saveSubmission(
      tx,
      { ...submission, memberId: actor.memberId, status: "submitted", submittedAt: new Date() },
      participants
    )
  );

import { db } from "@db/index";

import type { Auth } from "@/modules/auth/hooks/authenticate";

import { type SubmissionRow, saveSubmission } from "../repository/save-submission";

export type NewSubmission = Omit<SubmissionRow, "memberId" | "status" | "submittedAt"> & { participants: bigint[] };

// A submission arrives waiting for review. Nothing it claims is trusted until someone approves it,
// and no points exist until then.
export const createSubmission = async ({ participants, ...submission }: NewSubmission, auth: Auth) =>
  db.transaction(async (tx) =>
    saveSubmission(
      tx,
      { ...submission, memberId: auth.member.id, status: "submitted", submittedAt: new Date() },
      participants
    )
  );

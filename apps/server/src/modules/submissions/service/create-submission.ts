import { db } from "@db/index";

import { saveSubmission } from "../repository/save-submission";
import type { SubmissionRow } from "../repository/save-submission";

export type NewSubmission = Omit<SubmissionRow, "memberId" | "status" | "submittedAt"> & {
  participants: bigint[];
  submittedByMemberId: bigint;
};

// A submission arrives waiting for review. Nothing it claims is trusted until someone approves it,
// and no points exist until then.
export const createSubmission = async ({ participants, submittedByMemberId, ...submission }: NewSubmission) =>
  db.transaction(async (tx) =>
    saveSubmission(
      tx,
      { ...submission, memberId: submittedByMemberId, status: "submitted", submittedAt: new Date() },
      participants
    )
  );

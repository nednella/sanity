import { db } from "@db/index";

import type { Auth } from "@/modules/auth/hooks/authenticate";

import { type SubmissionRow, saveSubmission } from "../repository/save-submission";

export type NewSubmission = Omit<SubmissionRow, "memberId" | "source" | "status" | "submittedAt"> & {
  participants: bigint[];
};

// A submission arrives waiting for review. Nothing it claims is trusted until someone approves it,
// and no points exist until then.
export async function createSubmission({ participants, ...submission }: NewSubmission, auth: Auth) {
  return db.transaction(async (tx) =>
    saveSubmission(
      tx,
      {
        ...submission,
        memberId: auth.member.id,
        source: auth.client,
        status: "submitted",
        submittedAt: new Date()
      },
      participants
    )
  );
}

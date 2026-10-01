import type { Transaction } from "@db/index";
import { submissionParticipants, submissions } from "@db/schema";

export type SubmissionRow = typeof submissions.$inferInsert;

export const saveSubmission = async (tx: Transaction, submission: SubmissionRow, participants: bigint[]) => {
  const [saved] = await tx.insert(submissions).values(submission).returning({ id: submissions.id });

  const unique = [...new Set(participants)];
  if (unique.length > 0) {
    await tx.insert(submissionParticipants).values(unique.map((memberId) => ({ memberId, submissionId: saved!.id })));
  }

  return saved!.id;
};

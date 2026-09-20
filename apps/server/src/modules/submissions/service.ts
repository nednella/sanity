import { toSubmission } from "./mapper";
import { listParticipants, listSubmissions } from "./repo";

export const getSubmissions = async (options: Parameters<typeof listSubmissions>[0]) => {
  const rows = await listSubmissions(options);
  const participants = await listParticipants(rows.map((row) => row.submission.id));

  return rows.map((row) =>
    toSubmission(
      row,
      participants.filter((participant) => participant.submissionId === row.submission.id)
    )
  );
};

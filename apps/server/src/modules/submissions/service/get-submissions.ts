import { toSubmission } from "../mapper";
import { listParticipants } from "../repository/list-participants";
import type { ListSubmissionsOptions } from "../repository/list-submissions";
import { listSubmissions } from "../repository/list-submissions";

export const getSubmissions = async (options: ListSubmissionsOptions) => {
  const rows = await listSubmissions(options);
  const participants = await listParticipants(rows.map((row) => row.submission.id));

  return rows.map((row) =>
    toSubmission(
      row,
      participants.filter((participant) => participant.submissionId === row.submission.id)
    )
  );
};

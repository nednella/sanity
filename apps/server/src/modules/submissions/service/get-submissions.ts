import { toSubmission } from "../mapper";
import { countSubmissions } from "../repository/count-submissions";
import { listParticipants } from "../repository/list-participants";
import type { ListSubmissionsOptions } from "../repository/list-submissions";
import { listSubmissions } from "../repository/list-submissions";

export const getSubmissions = async (options: ListSubmissionsOptions) => {
  const [rows, total] = await Promise.all([listSubmissions(options), countSubmissions(options)]);
  const participants = await listParticipants(rows.map((row) => row.submission.id));

  return {
    items: rows.map((row) =>
      toSubmission(
        row,
        participants.filter((participant) => participant.submissionId === row.submission.id)
      )
    ),
    total
  };
};

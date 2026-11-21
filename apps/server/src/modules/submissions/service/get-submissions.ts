import { toSubmission } from "@/modules/submissions/mapper";
import { countSubmissions } from "@/modules/submissions/repository/count-submissions";
import { listParticipants } from "@/modules/submissions/repository/list-participants";
import { type ListSubmissionsOptions, listSubmissions } from "@/modules/submissions/repository/list-submissions";

export async function getSubmissions(options: ListSubmissionsOptions) {
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
}

import type { ParticipantRow } from "./repository/list-participants";
import type { SubmissionRow } from "./repository/list-submissions";

export const toSubmission = ({ submission, submittedBy }: SubmissionRow, participants: ParticipantRow[]) => ({
  id: submission.id,
  item: {
    id: submission.itemId,
    name: submission.itemName
  },
  valueMillions: submission.valueMillions,
  event: submission.event,
  imageUrl: submission.imageUrl,
  discordMessageUrl: submission.discordMessageUrl,
  submittedAt: submission.submittedAt,
  submittedBy,
  participants: participants.map(({ id, displayName, points }) => ({ id, displayName, points }))
});

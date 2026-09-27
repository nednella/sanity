import type { ParticipantRow } from "./repository/list-participants";
import type { SubmissionRow } from "./repository/list-submissions";

export const toSubmission = ({ item, submission, submittedBy }: SubmissionRow, participants: ParticipantRow[]) => ({
  id: submission.id,
  item: {
    id: submission.itemId,
    name: item?.name ?? submission.itemName,
    osrsItemId: item?.osrsItemId ?? null
  },
  valueMillions: submission.valueMillions,
  event: submission.event,
  status: submission.status,
  imageUrl: submission.imageUrl,
  discordMessageUrl: submission.discordMessageUrl,
  submittedAt: submission.submittedAt,
  submittedBy,
  participants: participants.map(({ id, displayName, points }) => ({ id, displayName, points }))
});

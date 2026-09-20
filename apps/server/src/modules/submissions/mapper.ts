import type { listParticipants, listSubmissions } from "./repo";

type SubmissionRow = Awaited<ReturnType<typeof listSubmissions>>[number];
type ParticipantRow = Awaited<ReturnType<typeof listParticipants>>[number];

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

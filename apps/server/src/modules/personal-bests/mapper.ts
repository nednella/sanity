import type { PersonalBestRow } from "./repository/list-personal-bests";
import type { TeamRow } from "./repository/list-teams";

export const toRankedPersonalBest = (
  { content, personalBest, position, submittedBy, timeSeconds }: PersonalBestRow,
  team: TeamRow[]
) => ({
  id: personalBest.id,
  position,
  content,
  scale: personalBest.scale,
  status: personalBest.status,
  timeSeconds,
  imageUrl: personalBest.imageUrl,
  submittedAt: personalBest.submittedAt,
  submittedBy,
  team: team.map(({ id, displayName }) => ({ id, displayName }))
});

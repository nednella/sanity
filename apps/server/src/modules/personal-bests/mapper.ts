import type { PersonalBestRow } from "./repository/list-recent-personal-bests";
import type { RankedPersonalBestRow } from "./repository/list-records";
import type { TeamRow } from "./repository/list-teams";

export const toPersonalBest = (
  { personalBest, timeSeconds, content, submittedBy }: PersonalBestRow,
  team: TeamRow[]
) => ({
  id: personalBest.id,
  content: {
    id: content.id,
    name: content.name,
    imageUrl: content.imageUrl
  },
  scale: personalBest.scale,
  timeSeconds,
  imageUrl: personalBest.imageUrl,
  submittedAt: personalBest.submittedAt,
  submittedBy,
  team: team.map(({ id, displayName }) => ({ id, displayName }))
});

export const toRankedPersonalBest = ({ position, ...row }: RankedPersonalBestRow, team: TeamRow[]) => ({
  ...toPersonalBest(row, team),
  position
});

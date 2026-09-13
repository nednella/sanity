import type { listRecentPersonalBests, listRecords, listTeams } from "./repo.js";

type PersonalBestRow = Awaited<ReturnType<typeof listRecentPersonalBests>>[number];
type RankedPersonalBestRow = Awaited<ReturnType<typeof listRecords>>[number];
type TeamRow = Awaited<ReturnType<typeof listTeams>>[number];

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

import { listTeams } from "../repository/list-teams";

// Every personal best carries its team, so the rows are fetched once and grouped per best.
export const listTeamsOf = async (rows: { personalBest: { id: number } }[]) => {
  const teams = await listTeams(rows.map((row) => row.personalBest.id));
  return (personalBestId: number) => teams.filter((member) => member.personalBestId === personalBestId);
};

import { toPersonalBest, toRankedPersonalBest } from "./mapper";
import { listMemberPersonalBests, listRecentPersonalBests, listRecords, listTeams } from "./repo";

const listTeamsOf = async (rows: { personalBest: { id: number } }[]) => {
  const teams = await listTeams(rows.map((row) => row.personalBest.id));
  return (personalBestId: number) => teams.filter((member) => member.personalBestId === personalBestId);
};

export const getRecentPersonalBests = async (options: Parameters<typeof listRecentPersonalBests>[0]) => {
  const rows = await listRecentPersonalBests(options);
  const teamOf = await listTeamsOf(rows);

  return rows.map((row) => toPersonalBest(row, teamOf(row.personalBest.id)));
};

export const getRecords = async (options: Parameters<typeof listRecords>[0]) => {
  const rows = await listRecords(options);
  const teamOf = await listTeamsOf(rows);

  return rows.map((row) => toRankedPersonalBest(row, teamOf(row.personalBest.id)));
};

export const getMemberPersonalBests = async (
  memberId: bigint,
  options: Parameters<typeof listMemberPersonalBests>[1]
) => {
  const rows = await listMemberPersonalBests(memberId, options);
  const teamOf = await listTeamsOf(rows);

  return rows.map((row) => toRankedPersonalBest(row, teamOf(row.personalBest.id)));
};

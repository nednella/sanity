import { toRankedPersonalBest } from "../mapper";
import { type ListRecordsOptions, listRecords } from "../repository/list-records";
import { groupTeamsByPersonalBest } from "./group-teams-by-personal-best";

export async function getRecords(options: ListRecordsOptions) {
  const rows = await listRecords(options);
  const teamOf = await groupTeamsByPersonalBest(rows);

  return rows.map((row) => toRankedPersonalBest(row, teamOf(row.personalBest.id)));
}

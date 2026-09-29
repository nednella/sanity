import { toRankedPersonalBest } from "../mapper";
import { type ListRecordsOptions, listRecords } from "../repository/list-records";
import { listTeamsOf } from "./list-teams-of";

export const getRecords = async (options: ListRecordsOptions) => {
  const rows = await listRecords(options);
  const teamOf = await listTeamsOf(rows);

  return rows.map((row) => toRankedPersonalBest(row, teamOf(row.personalBest.id)));
};

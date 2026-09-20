import { toPersonalBest } from "../mapper";
import type { ListRecentPersonalBestsOptions } from "../repository/list-recent-personal-bests";
import { listRecentPersonalBests } from "../repository/list-recent-personal-bests";
import { listTeamsOf } from "./list-teams-of";

export const getRecentPersonalBests = async (options: ListRecentPersonalBestsOptions) => {
  const rows = await listRecentPersonalBests(options);
  const teamOf = await listTeamsOf(rows);

  return rows.map((row) => toPersonalBest(row, teamOf(row.personalBest.id)));
};

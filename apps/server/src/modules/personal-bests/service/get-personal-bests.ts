import { toRankedPersonalBest } from "../mapper";
import { countPersonalBests } from "../repository/count-personal-bests";
import { type ListPersonalBestsOptions, listPersonalBests } from "../repository/list-personal-bests";
import { listTeamsOf } from "./list-teams-of";

export async function getPersonalBests(options: ListPersonalBestsOptions) {
  const [rows, total] = await Promise.all([listPersonalBests(options), countPersonalBests(options)]);
  const teamOf = await listTeamsOf(rows);

  return { items: rows.map((row) => toRankedPersonalBest(row, teamOf(row.personalBest.id))), total };
}

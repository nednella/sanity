import { toRankedPersonalBest } from "@/modules/personal-bests/mapper";
import { countPersonalBests } from "@/modules/personal-bests/repository/count-personal-bests";
import {
  type ListPersonalBestsOptions,
  listPersonalBests
} from "@/modules/personal-bests/repository/list-personal-bests";

import { groupTeamsByPersonalBest } from "./group-teams-by-personal-best";

export async function getPersonalBests(options: ListPersonalBestsOptions) {
  const [rows, total] = await Promise.all([listPersonalBests(options), countPersonalBests(options)]);
  const teamOf = await groupTeamsByPersonalBest(rows);

  return { items: rows.map((row) => toRankedPersonalBest(row, teamOf(row.personalBest.id))), total };
}

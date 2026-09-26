import { toRankedPersonalBest } from "../mapper";
import { countMemberPersonalBests } from "../repository/count-member-personal-bests";
import type { ListMemberPersonalBestsOptions } from "../repository/list-member-personal-bests";
import { listMemberPersonalBests } from "../repository/list-member-personal-bests";
import { listTeamsOf } from "./list-teams-of";

export const getMemberPersonalBests = async (memberId: bigint, options: ListMemberPersonalBestsOptions) => {
  const [rows, total] = await Promise.all([
    listMemberPersonalBests(memberId, options),
    countMemberPersonalBests(memberId, options)
  ]);

  const teamOf = await listTeamsOf(rows);

  return { items: rows.map((row) => toRankedPersonalBest(row, teamOf(row.personalBest.id))), total };
};

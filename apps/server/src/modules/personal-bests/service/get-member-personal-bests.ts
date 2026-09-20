import { toRankedPersonalBest } from "../mapper";
import type { ListMemberPersonalBestsOptions } from "../repository/list-member-personal-bests";
import { listMemberPersonalBests } from "../repository/list-member-personal-bests";
import { listTeamsOf } from "./list-teams-of";

export const getMemberPersonalBests = async (memberId: bigint, options: ListMemberPersonalBestsOptions) => {
  const rows = await listMemberPersonalBests(memberId, options);
  const teamOf = await listTeamsOf(rows);

  return rows.map((row) => toRankedPersonalBest(row, teamOf(row.personalBest.id)));
};

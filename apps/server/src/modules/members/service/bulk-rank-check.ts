import { toRankIconUrl } from "@/modules/ranks/mapper";
import { listRanks } from "@/modules/ranks/repository/list-ranks";
import { RANK_IDS_OFF_LADDER, toEarnedRank } from "@/modules/ranks/rules";

import { listMemberStandings } from "../repository/list-member-standings";

export const bulkRankCheck = async () => {
  const ranks = await listRanks();
  const standings = await listMemberStandings();
  const rankById = new Map(ranks.map((rank) => [rank.id, rank]));

  const toRank = (id: number) => {
    const rank = rankById.get(id);
    return { iconUrl: rank ? toRankIconUrl(rank.inGameName) : null, id, name: rank?.name ?? String(id) };
  };

  const proposals = standings.flatMap((standing) => {
    if (RANK_IDS_OFF_LADDER.has(standing.rankId)) return [];

    const earned = toEarnedRank(ranks, standing);
    if (!earned || earned.id === standing.rankId) return [];

    const isDemotion = earned.id < standing.rankId;

    return [
      {
        direction: isDemotion ? ("demotion" as const) : ("promotion" as const),
        discordId: standing.discordId,
        displayName: standing.displayName,
        from: toRank(standing.rankId),
        memberId: standing.id,
        standing: {
          clanPoints: standing.clanPoints,
          diaryPoints: standing.diaryPoints,
          masterDiaries: standing.masterDiaries
        },
        to: toRank(earned.id)
      }
    ];
  });

  return { checked: standings.length, proposals };
};

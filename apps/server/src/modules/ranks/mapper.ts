import { osrsWikiImageUrl } from "@sanity/utils";

import type { RankRow } from "./repository/list-ranks";

export function toRankIconUrl(inGameName: string | null) {
  return inGameName && osrsWikiImageUrl(`Clan_icon_-_${inGameName}.png`);
}

export function toRankSummary(row: RankRow) {
  return {
    id: row.id,
    name: row.name,
    iconUrl: toRankIconUrl(row.inGameName)
  };
}

export function toRank(row: RankRow) {
  return {
    ...toRankSummary(row),
    discordRoleId: row.discordRoleId,
    requirements: {
      clanPoints: row.clanPointRequirement,
      diaryPoints: row.diaryPointRequirement,
      masterDiaries: row.masterDiaryRequirement
    }
  };
}

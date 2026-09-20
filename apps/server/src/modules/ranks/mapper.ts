import { osrsWikiImageUrl } from "@/utils/images";

import type { RankRow } from "./repository/list-ranks";

export const toRankIconUrl = (inGameName: string | null) =>
  inGameName && osrsWikiImageUrl(`Clan_icon_-_${inGameName}.png`);

export const toRank = (row: RankRow) => ({
  id: row.id,
  name: row.name,
  iconUrl: toRankIconUrl(row.inGameName),
  discordRoleId: row.discordRoleId,
  requirements: {
    clanPoints: row.clanPointRequirement,
    diaryPoints: row.diaryPointRequirement,
    masterDiaries: row.masterDiaryRequirement,
    maintenancePoints: row.maintenancePointRequirement
  }
});

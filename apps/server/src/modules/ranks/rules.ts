import { QUIT_RANK_ID, RETIRED_RANK_ID, TRIALIST_RANK_ID } from "./constants";
import type { RankRow } from "./repository/list-ranks";

export type Standing = {
  clanPoints: number;
  diaryPoints: number;
  masterDiaries: number;
};

export const RANK_IDS_OFF_LADDER = new Set([QUIT_RANK_ID, RETIRED_RANK_ID, TRIALIST_RANK_ID]);

export const toActiveRanks = (ranks: RankRow[]) => ranks.filter((rank) => !RANK_IDS_OFF_LADDER.has(rank.id));

export const hasMetRequirements = (rank: RankRow, standing: Standing) =>
  standing.clanPoints >= rank.clanPointRequirement &&
  (standing.diaryPoints >= rank.diaryPointRequirement || standing.masterDiaries >= rank.masterDiaryRequirement);

export const toEarnedRank = (ranks: RankRow[], standing: Standing) =>
  toActiveRanks(ranks).findLast((rank) => hasMetRequirements(rank, standing));

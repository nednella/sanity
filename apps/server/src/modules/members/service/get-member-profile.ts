import { listRanks } from "@/modules/ranks/repository/list-ranks";
import { listDiaryProgress } from "@/modules/speedrun-diary/repository/list-diary-progress";
import { findLatestSnapshot } from "@/modules/wom/repository/find-latest-snapshot";

import { toMemberProfile } from "../mapper";
import { findMember } from "../repository/find-member";

export const getMemberProfile = async (id: bigint) => {
  const row = await findMember(id);
  if (!row) return;

  const [diaryProgress] = await listDiaryProgress([id]);
  const ranks = await listRanks();
  const latestSnapshot = row.womPlayer ? await findLatestSnapshot(row.womPlayer.womPlayerId) : undefined;

  return toMemberProfile(row, diaryProgress, ranks, latestSnapshot);
};

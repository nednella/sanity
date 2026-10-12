import { listRanks } from "@/modules/ranks/repository/list-ranks";
import { listDiaryProgress } from "@/modules/speedrun-diary/repository/list-diary-progress";
import { findLatestSnapshot } from "@/modules/wom/repository/find-latest-snapshot";
import { listNameChanges } from "@/modules/wom/repository/list-name-changes";

import { toMemberProfile } from "../mapper";
import { findMember } from "../repository/find-member";

export const getMemberProfile = async (id: bigint) => {
  const row = await findMember(id);
  if (!row) return;

  const [[diaryProgress], ranks, latestSnapshot, nameChanges] = await Promise.all([
    listDiaryProgress([id]),
    listRanks(),
    row.womPlayer ? findLatestSnapshot(row.womPlayer.womPlayerId) : undefined,
    row.womPlayer ? listNameChanges(row.womPlayer.womPlayerId) : []
  ]);

  return toMemberProfile(row, diaryProgress, ranks, latestSnapshot, nameChanges);
};

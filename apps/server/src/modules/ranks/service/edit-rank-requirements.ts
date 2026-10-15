import { db } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import { findMemberIdByDiscordId } from "@/modules/members/repository/find-member-id-by-discord-id";

import { type RankRequirements, updateRankRequirements } from "../repository/update-rank-requirements";

const describe = ({ clanPoints, diaryPoints, masterDiaries }: RankRequirements) =>
  `${clanPoints} clan points, ${diaryPoints} diary points or ${masterDiaries} master diaries`;

export const editRankRequirements = async (
  rankId: number,
  { actingDiscordId, ...requirements }: RankRequirements & { actingDiscordId?: bigint }
) =>
  db.transaction(async (tx) => {
    const previous = await updateRankRequirements(tx, rankId, requirements);
    if (!previous) return false;

    const before = describe({
      clanPoints: previous.clanPointRequirement,
      diaryPoints: previous.diaryPointRequirement,
      masterDiaries: previous.masterDiaryRequirement
    });

    await recordAuditEntry(tx, {
      actingMemberId: await findMemberIdByDiscordId(tx, actingDiscordId),
      action: "catalogue_changed",
      note: `${previous.name} requirements ${before} to ${describe(requirements)}`,
      source: "server"
    });

    return true;
  });

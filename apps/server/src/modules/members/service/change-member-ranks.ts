import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import { QUIT_RANK_ID, RETIRED_RANK_ID } from "@/modules/ranks/constants";
import { findRank } from "@/modules/ranks/repository/find-rank";

import { setMemberRank } from "../repository/set-member-rank";
import { type AdminCommand, executePerTaggedMember } from "./shared/execute-per-tagged-member";

export type RankChange = AdminCommand & { rankId: number };

export const changeMemberRanks = async ({ note, rankId, ...command }: RankChange) =>
  executePerTaggedMember(command, async (tx, member, actingMemberId) => {
    if (rankId === QUIT_RANK_ID || rankId === RETIRED_RANK_ID) return { outcome: "not-a-rank-change" as const };
    if (member.rankId === QUIT_RANK_ID) return { outcome: "has-quit" as const };
    if (member.rankId === rankId) return { outcome: "unchanged" as const };

    const rank = await findRank(tx, rankId);
    if (!rank) return { outcome: "unknown-rank" as const };

    const from = await findRank(tx, member.rankId);
    await setMemberRank(tx, member.id, rankId);

    await recordAuditEntry(tx, {
      actingMemberId,
      action: "rank_changed",
      affects: [member.id],
      note: note ?? `${from?.name ?? member.rankId} to ${rank.name}`,
      source: "server"
    });

    return { outcome: "ranked" as const, rank: { id: rank.id, name: rank.name } };
  });

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import { QUIT_RANK_ID, RETIRED_RANK_ID } from "@/modules/ranks/constants";
import { toRankSummary } from "@/modules/ranks/mapper";
import { listRanks } from "@/modules/ranks/repository/list-ranks";

import { setMemberRank } from "../repository/set-member-rank";
import type { AdminCommand } from "../request";
import { executePerTaggedMember } from "./shared/execute-per-tagged-member";

export type RankChange = AdminCommand & { rankId: number };

export const changeMemberRanks = async ({ note, rankId, ...command }: RankChange) => {
  const rows = await listRanks();
  const ranks = new Map(rows.map((rank) => [rank.id, rank]));

  return executePerTaggedMember(command, async (tx, member, actingMemberId) => {
    if (rankId === QUIT_RANK_ID || rankId === RETIRED_RANK_ID) return { outcome: "not-a-rank-change" as const };
    if (member.rankId === QUIT_RANK_ID) return { outcome: "has-quit" as const };
    if (member.rankId === rankId) return { outcome: "unchanged" as const };

    const rank = ranks.get(rankId);
    if (!rank) return { outcome: "unknown-rank" as const };

    const from = ranks.get(member.rankId);
    await setMemberRank(tx, member.id, rankId);

    await recordAuditEntry(tx, {
      actingMemberId,
      action: "rank_changed",
      affects: [member.id],
      note: note ?? `${from?.name ?? member.rankId} to ${rank.name}`,
      source: "server"
    });

    return { outcome: "ranked" as const, rank: toRankSummary(rank) };
  });
};

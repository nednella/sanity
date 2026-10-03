import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import { QUIT_RANK_ID, RETIRED_RANK_ID } from "@/modules/ranks/constants";
import { listRanks } from "@/modules/ranks/repository/list-ranks";
import { toEarnedRank } from "@/modules/ranks/rules";

import { findMemberStanding } from "../repository/find-member-standing";
import { setMemberRank } from "../repository/set-member-rank";
import { type AdminCommand, executePerTaggedMember } from "./shared/execute-per-tagged-member";

export const unretireMembers = async ({ note, ...command }: AdminCommand) => {
  const ranks = await listRanks();

  return executePerTaggedMember(command, async (tx, member, actingMemberId) => {
    if (member.rankId === QUIT_RANK_ID) return { outcome: "has-quit" as const };
    if (member.rankId !== RETIRED_RANK_ID) return { outcome: "not-retired" as const };

    const standing = await findMemberStanding(tx, member.id);
    const earned = standing && toEarnedRank(ranks, standing);
    if (!earned) return { outcome: "no-rank-earned" as const };

    await setMemberRank(tx, member.id, earned.id);
    await recordAuditEntry(tx, {
      actingMemberId,
      action: "rank_changed",
      affects: [member.id],
      note: note ?? `unretired as ${earned.name}`,
      source: "server"
    });

    return { outcome: "unretired" as const, rank: { id: earned.id, name: earned.name } };
  });
};

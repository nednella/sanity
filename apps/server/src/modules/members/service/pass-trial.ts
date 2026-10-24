import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import type { Actor } from "@/modules/auth/service/authenticate";
import { TRIALIST_RANK_ID } from "@/modules/ranks/constants";
import { toRankSummary } from "@/modules/ranks/mapper";
import { listRanks } from "@/modules/ranks/repository/list-ranks";
import { toActiveRanks } from "@/modules/ranks/rules";

import { setMemberRank } from "../repository/set-member-rank";
import type { AdminCommand } from "../request";
import { executePerTaggedMember } from "./shared/execute-per-tagged-member";

export const passTrial = async ({ note, ...command }: AdminCommand, actor: Actor) => {
  const [first] = toActiveRanks(await listRanks());

  return executePerTaggedMember(command, async (tx, member) => {
    if (!first) return { outcome: "no-rank-to-give" as const };
    if (member.rankId !== TRIALIST_RANK_ID) return { outcome: "not-a-trialist" as const };

    await setMemberRank(tx, member.id, first.id);
    await recordAuditEntry(tx, {
      actingMemberId: actor.memberId,
      action: "rank_changed",
      affects: [member.id],
      note: note ?? `passed trial as ${first.name}`,
      source: actor.source
    });

    return { outcome: "passed" as const, rank: toRankSummary(first) };
  });
};

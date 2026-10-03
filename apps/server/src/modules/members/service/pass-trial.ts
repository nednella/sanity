import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import { TRIALIST_RANK_ID } from "@/modules/ranks/constants";
import { listRanks } from "@/modules/ranks/repository/list-ranks";
import { toActiveRanks } from "@/modules/ranks/rules";

import { setMemberRank } from "../repository/set-member-rank";
import { type AdminCommand, executePerTaggedMember } from "./shared/execute-per-tagged-member";

export const passTrial = async ({ note, ...command }: AdminCommand) => {
  const [first] = toActiveRanks(await listRanks());

  return executePerTaggedMember(command, async (tx, member, actingMemberId) => {
    if (!first) return { outcome: "no-rank-to-give" as const };
    if (member.rankId !== TRIALIST_RANK_ID) return { outcome: "not-a-trialist" as const };

    await setMemberRank(tx, member.id, first.id);
    await recordAuditEntry(tx, {
      actingMemberId,
      action: "rank_changed",
      affects: [member.id],
      note: note ?? `passed trial as ${first.name}`,
      source: "server"
    });

    return { outcome: "passed" as const, rank: { id: first.id, name: first.name } };
  });
};

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import { QUIT_RANK_ID, RETIRED_RANK_ID } from "@/modules/ranks/constants";

import { setMemberRank } from "../repository/set-member-rank";
import { type AdminCommand, executePerTaggedMember } from "./shared/execute-per-tagged-member";

export const retireMembers = async ({ note, ...command }: AdminCommand) =>
  executePerTaggedMember(command, async (tx, member, actingMemberId) => {
    if (member.rankId === QUIT_RANK_ID) return { outcome: "has-quit" as const };
    if (member.rankId === RETIRED_RANK_ID) return { outcome: "already-retired" as const };

    await setMemberRank(tx, member.id, RETIRED_RANK_ID);
    await recordAuditEntry(tx, {
      actingMemberId,
      action: "rank_changed",
      affects: [member.id],
      note: note ?? "retired",
      source: "server"
    });

    return { outcome: "retired" as const };
  });

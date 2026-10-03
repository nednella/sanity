import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import { QUIT_RANK_ID } from "@/modules/ranks/constants";

import { setMemberRank } from "../repository/set-member-rank";
import { type AdminCommand, executePerTaggedMember } from "./shared/execute-per-tagged-member";

export const quitMembers = async ({ note, ...command }: AdminCommand) =>
  executePerTaggedMember(command, async (tx, member, actingMemberId) => {
    if (member.rankId === QUIT_RANK_ID) return { outcome: "already-quit" as const };

    await setMemberRank(tx, member.id, QUIT_RANK_ID);
    await recordAuditEntry(tx, {
      actingMemberId,
      action: "member_left",
      affects: [member.id],
      note,
      source: "server"
    });

    return { outcome: "quit" as const };
  });

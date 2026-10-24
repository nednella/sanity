import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import type { Actor } from "@/modules/auth/service/authenticate";
import { QUIT_RANK_ID } from "@/modules/ranks/constants";

import { setMemberRank } from "../repository/set-member-rank";
import type { AdminCommand } from "../request";
import { executePerTaggedMember } from "./shared/execute-per-tagged-member";

export const quitMembers = async ({ note, ...command }: AdminCommand, actor: Actor) =>
  executePerTaggedMember(command, async (tx, member) => {
    if (member.rankId === QUIT_RANK_ID) return { outcome: "already-quit" as const };

    await setMemberRank(tx, member.id, QUIT_RANK_ID);
    await recordAuditEntry(tx, {
      actingMemberId: actor.memberId,
      action: "member_left",
      affects: [member.id],
      note,
      source: actor.source
    });

    return { outcome: "quit" as const };
  });

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import type { Auth } from "@/modules/auth/hooks/authenticate";
import { QUIT_RANK_ID } from "@/modules/ranks/constants";

import { setMemberRank } from "../repository/set-member-rank";
import type { AdminCommand } from "../request";
import { executePerTaggedMember } from "./shared/execute-per-tagged-member";

export const quitMembers = async ({ note, ...command }: AdminCommand, auth: Auth) =>
  executePerTaggedMember(command, async (tx, member) => {
    if (member.rankId === QUIT_RANK_ID) return { outcome: "already-quit" as const };

    await setMemberRank(tx, member.id, QUIT_RANK_ID);
    await recordAuditEntry(tx, {
      actingMemberId: auth.member.id,
      action: "member_left",
      affects: [member.id],
      note,
      source: auth.client
    });

    return { outcome: "quit" as const };
  });

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import type { Auth } from "@/modules/auth/service/authenticate";
import { QUIT_RANK_ID, RETIRED_RANK_ID } from "@/modules/ranks/constants";

import { setMemberRank } from "../repository/set-member-rank";
import type { AdminCommand } from "../request";
import { executePerTaggedMember } from "./shared/execute-per-tagged-member";

export const retireMembers = async ({ note, ...command }: AdminCommand, auth: Auth) =>
  executePerTaggedMember(command, async (tx, member) => {
    if (member.rankId === QUIT_RANK_ID) return { outcome: "has-quit" as const };
    if (member.rankId === RETIRED_RANK_ID) return { outcome: "already-retired" as const };

    await setMemberRank(tx, member.id, RETIRED_RANK_ID);
    await recordAuditEntry(tx, {
      actingMemberId: auth.member.id,
      action: "rank_changed",
      affects: [member.id],
      note: note ?? "retired",
      source: auth.client
    });

    return { outcome: "retired" as const };
  });

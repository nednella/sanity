import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import type { Actor } from "@/modules/auth/service/authenticate";
import { firstOfNextMonth } from "@/utils/dates";

import { delayRankChange } from "../repository/delay-rank-change";
import type { AdminCommand } from "../request";
import { executePerTaggedMember } from "./shared/execute-per-tagged-member";

export const delayDemotions = async (command: AdminCommand, actor: Actor) => {
  const until = firstOfNextMonth(new Date());

  return executePerTaggedMember(command, async (tx, member) => {
    await delayRankChange(tx, [member.id], until);
    await recordAuditEntry(tx, {
      actingMemberId: actor.memberId,
      action: "rank_changed",
      affects: [member.id],
      note: `demotion delayed until ${until.toISOString().slice(0, 10)}`,
      source: actor.source
    });

    return { outcome: "delayed" as const, until };
  });
};

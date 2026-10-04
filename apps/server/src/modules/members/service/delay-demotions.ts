import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import { firstOfNextMonth } from "@/utils/dates";

import { delayRankChange } from "../repository/delay-rank-change";
import { type AdminCommand, executePerTaggedMember } from "./shared/execute-per-tagged-member";

export const delayDemotions = async ({ ...command }: AdminCommand) => {
  const until = firstOfNextMonth(new Date());

  return executePerTaggedMember(command, async (tx, member, actingMemberId) => {
    await delayRankChange(tx, [member.id], until);
    await recordAuditEntry(tx, {
      actingMemberId,
      action: "rank_changed",
      affects: [member.id],
      note: `demotion delayed until ${until.toISOString().slice(0, 10)}`,
      source: "server"
    });

    return { outcome: "delayed" as const, until: until.toISOString() };
  });
};

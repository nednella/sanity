import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import type { Auth } from "@/modules/auth/hooks/authenticate";
import { firstOfNextMonth } from "@/utils/dates";

import { delayRankChange } from "../repository/delay-rank-change";
import type { AdminCommand } from "../request";
import { executePerTaggedMember } from "./shared/execute-per-tagged-member";

export async function delayDemotions(command: AdminCommand, auth: Auth) {
  const until = firstOfNextMonth(new Date());

  return executePerTaggedMember(command, async (tx, member) => {
    await delayRankChange(tx, [member.id], until);
    await recordAuditEntry(tx, {
      actingMemberId: auth.member.id,
      action: "rank_changed",
      affects: [member.id],
      note: `demotion delayed until ${until.toISOString().slice(0, 10)}`,
      source: auth.client
    });

    return { outcome: "delayed" as const, until };
  });
}

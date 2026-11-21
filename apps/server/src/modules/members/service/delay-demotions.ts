import { firstOfNextMonth, toIsoDate } from "@sanity/utils";

import { db } from "@db/index";

import { recordAuditEntries } from "@/modules/audit/repository/record-audit-entries";
import type { ActingAuth } from "@/modules/auth/hooks/authenticate";
import { delayRankChange } from "@/modules/members/repository/delay-rank-change";
import { listMemberIdsByRef } from "@/modules/members/repository/list-member-ids-by-ref";
import { listMembersById } from "@/modules/members/repository/list-members-by-id";
import type { MemberBatch } from "@/modules/members/request";

export async function delayDemotions({ members }: MemberBatch, auth: ActingAuth) {
  const until = firstOfNextMonth(new Date());

  return db.transaction(async (tx) => {
    const memberIds = await listMemberIdsByRef(tx, members);
    const found = await listMembersById(tx, memberIds);
    const changed = found.map((member) => ({ member, until }));

    await delayRankChange(tx, memberIds, until);
    await recordAuditEntries(tx, auth, {
      action: "rank_changed",
      changes: changed,
      toNote: () => `demotion delayed until ${toIsoDate(until)}`
    });

    return { changed, skipped: [] };
  });
}

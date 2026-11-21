import { db } from "@db/index";

import type { ApplicationError } from "@/errors/error";
import { recordAuditEntries } from "@/modules/audit/repository/record-audit-entries";
import type { ActingAuth } from "@/modules/auth/hooks/authenticate";
import { memberErrors } from "@/modules/members/errors";
import { listMemberIdsByRef } from "@/modules/members/repository/list-member-ids-by-ref";
import { listMembersById } from "@/modules/members/repository/list-members-by-id";
import { setMemberRanks } from "@/modules/members/repository/set-member-ranks";
import type { MemberBatch } from "@/modules/members/request";
import { TRIALIST_RANK_ID } from "@/modules/ranks/constants";
import { toRankSummary } from "@/modules/ranks/mapper";
import { listRanks } from "@/modules/ranks/repository/list-ranks";
import { toActiveRanks } from "@/modules/ranks/rules";

type Member = Awaited<ReturnType<typeof listMembersById>>[number];

export async function passMembers({ members, note }: MemberBatch, auth: ActingAuth) {
  const [first] = toActiveRanks(await listRanks());
  if (!first) throw memberErrors.noRankToGive();

  const rank = toRankSummary(first);

  return db.transaction(async (tx) => {
    const memberIds = await listMemberIdsByRef(tx, members);
    const found = await listMembersById(tx, memberIds);

    const changed: { member: Member; rank: typeof rank }[] = [];
    const skipped: { error: ApplicationError; member: Member }[] = [];

    for (const member of found) {
      if (member.rankId === TRIALIST_RANK_ID) changed.push({ member, rank });
      else skipped.push({ member, error: memberErrors.notTrialist() });
    }

    await setMemberRanks(
      tx,
      changed.map(({ member }) => ({ memberId: member.id, rankId: rank.id }))
    );
    await recordAuditEntries(tx, auth, {
      action: "rank_changed",
      changes: changed,
      toNote: () => note ?? `passed trial as ${rank.name}`
    });

    return { changed, skipped };
  });
}

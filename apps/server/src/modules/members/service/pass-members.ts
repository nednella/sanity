import { db } from "@db/index";

import type { ApplicationError } from "@/errors/error";
import { recordAuditEntries } from "@/modules/audit/repository/record-audit-entries";
import type { Auth } from "@/modules/auth/hooks/authenticate";
import { TRIALIST_RANK_ID } from "@/modules/ranks/constants";
import { toRankSummary } from "@/modules/ranks/mapper";
import { listRanks } from "@/modules/ranks/repository/list-ranks";
import { toActiveRanks } from "@/modules/ranks/rules";

import { memberErrors } from "../errors";
import { listMemberIdsByRef } from "../repository/list-member-ids-by-ref";
import { listMembersById } from "../repository/list-members-by-id";
import { setMemberRanks } from "../repository/set-member-ranks";
import type { MemberCommand } from "../request";

type Member = Awaited<ReturnType<typeof listMembersById>>[number];

export async function passMembers({ members, note }: MemberCommand, auth: Auth) {
  const [first] = toActiveRanks(await listRanks());
  if (!first) throw memberErrors.noRankToGive();

  const rank = toRankSummary(first);

  return db.transaction(async (tx) => {
    const memberIds = await listMemberIdsByRef(tx, members);
    const found = await listMembersById(tx, memberIds);

    const changed: { member: Member; rank: typeof rank }[] = [];
    const skipped: { member: Member; error: ApplicationError }[] = [];

    for (const member of found) {
      if (member.rankId === TRIALIST_RANK_ID) changed.push({ member, rank });
      else skipped.push({ member, error: memberErrors.notTrialist() });
    }

    await setMemberRanks(
      tx,
      changed.map(({ member }) => ({ memberId: member.id, rankId: rank.id }))
    );
    await recordAuditEntries(tx, auth, "rank_changed", changed, () => note ?? `passed trial as ${rank.name}`);

    return { changed, skipped };
  });
}

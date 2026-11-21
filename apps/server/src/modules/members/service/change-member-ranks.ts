import { db } from "@db/index";

import type { ApplicationError } from "@/errors/error";
import { recordAuditEntries } from "@/modules/audit/repository/record-audit-entries";
import type { ActingAuth } from "@/modules/auth/hooks/authenticate";
import { memberErrors } from "@/modules/members/errors";
import { listMemberIdsByRef } from "@/modules/members/repository/list-member-ids-by-ref";
import { listMembersById } from "@/modules/members/repository/list-members-by-id";
import { setMemberRanks } from "@/modules/members/repository/set-member-ranks";
import type { RankChange } from "@/modules/members/request";
import { QUIT_RANK_ID } from "@/modules/ranks/constants";
import { toRankSummary } from "@/modules/ranks/mapper";
import { listRanks } from "@/modules/ranks/repository/list-ranks";

type Member = Awaited<ReturnType<typeof listMembersById>>[number];

export async function changeMemberRanks({ members, note, rankId }: RankChange, auth: ActingAuth) {
  const rankRows = await listRanks();
  const ranks = new Map(rankRows.map((row) => [row.id, row]));
  const target = ranks.get(rankId);
  if (!target) throw memberErrors.unknownRank(rankId);

  const rank = toRankSummary(target);

  return db.transaction(async (tx) => {
    const memberIds = await listMemberIdsByRef(tx, members);
    const found = await listMembersById(tx, memberIds);

    const changed: { member: Member; rank: typeof rank }[] = [];
    const skipped: { error: ApplicationError; member: Member }[] = [];

    for (const member of found) {
      if (member.rankId === QUIT_RANK_ID) skipped.push({ member, error: memberErrors.hasQuit() });
      else if (member.rankId === rankId) skipped.push({ member, error: memberErrors.alreadyRank() });
      else changed.push({ member, rank });
    }

    await setMemberRanks(
      tx,
      changed.map(({ member }) => ({ memberId: member.id, rankId }))
    );
    await recordAuditEntries(
      tx,
      auth,
      "rank_changed",
      changed,
      ({ member }) => note ?? `${ranks.get(member.rankId)?.name ?? member.rankId} to ${rank.name}`
    );

    return { changed, skipped };
  });
}

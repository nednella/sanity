import { db } from "@db/index";

import type { ApplicationError } from "@/errors/error";
import { recordAuditEntries } from "@/modules/audit/repository/record-audit-entries";
import type { ActingAuth } from "@/modules/auth/hooks/authenticate";
import { memberErrors } from "@/modules/members/errors";
import { listMemberIdsByRef } from "@/modules/members/repository/list-member-ids-by-ref";
import { listMemberStandings } from "@/modules/members/repository/list-member-standings";
import { setMemberRanks } from "@/modules/members/repository/set-member-ranks";
import type { MemberBatch } from "@/modules/members/request";
import { QUIT_RANK_ID, RETIRED_RANK_ID } from "@/modules/ranks/constants";
import { toRankSummary } from "@/modules/ranks/mapper";
import { listRanks } from "@/modules/ranks/repository/list-ranks";
import { toEarnedRank } from "@/modules/ranks/rules";

type MemberStanding = Awaited<ReturnType<typeof listMemberStandings>>[number];

type RankSummary = ReturnType<typeof toRankSummary>;

export async function unretireMembers({ members, note }: MemberBatch, auth: ActingAuth) {
  const ranks = await listRanks();

  return db.transaction(async (tx) => {
    const memberIds = await listMemberIdsByRef(tx, members);
    const standings = await listMemberStandings(tx, memberIds);

    const changed: { member: MemberStanding; rank: RankSummary }[] = [];
    const skipped: { error: ApplicationError; member: MemberStanding }[] = [];

    for (const member of standings) {
      const earned = toEarnedRank(ranks, member);

      if (member.rankId === QUIT_RANK_ID) skipped.push({ member, error: memberErrors.hasQuit() });
      else if (member.rankId !== RETIRED_RANK_ID) skipped.push({ member, error: memberErrors.notRetired() });
      else if (earned) changed.push({ member, rank: toRankSummary(earned) });
      else skipped.push({ member, error: memberErrors.noRankEarned() });
    }

    await setMemberRanks(
      tx,
      changed.map(({ member, rank }) => ({ memberId: member.id, rankId: rank.id }))
    );
    await recordAuditEntries(tx, auth, {
      action: "rank_changed",
      changes: changed,
      toNote: ({ rank }) => note ?? `unretired as ${rank.name}`
    });

    return { changed, skipped };
  });
}

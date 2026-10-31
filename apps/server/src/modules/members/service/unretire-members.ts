import { db } from "@db/index";

import type { ApplicationError } from "@/errors/error";
import { recordAuditEntries } from "@/modules/audit/repository/record-audit-entries";
import type { Auth } from "@/modules/auth/hooks/authenticate";
import { QUIT_RANK_ID, RETIRED_RANK_ID } from "@/modules/ranks/constants";
import { toRankSummary } from "@/modules/ranks/mapper";
import { listRanks } from "@/modules/ranks/repository/list-ranks";
import { toEarnedRank } from "@/modules/ranks/rules";

import { memberErrors } from "../errors";
import { listMemberIdsByRef } from "../repository/list-member-ids-by-ref";
import { listMemberStandings } from "../repository/list-member-standings";
import { setMemberRanks } from "../repository/set-member-ranks";
import type { MemberCommand } from "../request";

type MemberStanding = Awaited<ReturnType<typeof listMemberStandings>>[number];

type RankSummary = ReturnType<typeof toRankSummary>;

export async function unretireMembers({ members, note }: MemberCommand, auth: Auth) {
  const ranks = await listRanks();

  return db.transaction(async (tx) => {
    const memberIds = await listMemberIdsByRef(tx, members);
    const standings = await listMemberStandings(tx, memberIds);

    const changed: { member: MemberStanding; rank: RankSummary }[] = [];
    const skipped: { member: MemberStanding; error: ApplicationError }[] = [];

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
    await recordAuditEntries(tx, auth, "rank_changed", changed, ({ rank }) => note ?? `unretired as ${rank.name}`);

    return { changed, skipped };
  });
}

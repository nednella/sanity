import { db } from "@db/index";

import type { ApplicationError } from "@/errors/error";
import { recordAuditEntries } from "@/modules/audit/repository/record-audit-entries";
import type { ActingAuth } from "@/modules/auth/hooks/authenticate";
import { memberErrors } from "@/modules/members/errors";
import { listMemberIdsByRef } from "@/modules/members/repository/list-member-ids-by-ref";
import { listMembersById } from "@/modules/members/repository/list-members-by-id";
import { setMemberRanks } from "@/modules/members/repository/set-member-ranks";
import type { MemberBatch } from "@/modules/members/request";
import { QUIT_RANK_ID } from "@/modules/ranks/constants";

type Member = Awaited<ReturnType<typeof listMembersById>>[number];

export async function quitMembers({ members, note }: MemberBatch, auth: ActingAuth) {
  return db.transaction(async (tx) => {
    const memberIds = await listMemberIdsByRef(tx, members);
    const found = await listMembersById(tx, memberIds);

    const changed: { member: Member }[] = [];
    const skipped: { error: ApplicationError; member: Member }[] = [];

    for (const member of found) {
      if (member.rankId === QUIT_RANK_ID) skipped.push({ member, error: memberErrors.alreadyQuit() });
      else changed.push({ member });
    }

    await setMemberRanks(
      tx,
      changed.map(({ member }) => ({ memberId: member.id, rankId: QUIT_RANK_ID }))
    );
    await recordAuditEntries(tx, auth, {
      action: "member_left",
      changes: changed,
      toNote: () => note
    });

    return { changed, skipped };
  });
}

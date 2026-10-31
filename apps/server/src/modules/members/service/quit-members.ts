import { db } from "@db/index";

import type { ApplicationError } from "@/errors/error";
import { recordAuditEntries } from "@/modules/audit/repository/record-audit-entries";
import type { Auth } from "@/modules/auth/hooks/authenticate";
import { QUIT_RANK_ID } from "@/modules/ranks/constants";

import { memberErrors } from "../errors";
import { listMemberIdsByRef } from "../repository/list-member-ids-by-ref";
import { listMembersById } from "../repository/list-members-by-id";
import { setMemberRanks } from "../repository/set-member-ranks";
import type { MemberBatch } from "../request";

type Member = Awaited<ReturnType<typeof listMembersById>>[number];

export async function quitMembers({ members, note }: MemberBatch, auth: Auth) {
  return db.transaction(async (tx) => {
    const memberIds = await listMemberIdsByRef(tx, members);
    const found = await listMembersById(tx, memberIds);

    const changed: { member: Member }[] = [];
    const skipped: { member: Member; error: ApplicationError }[] = [];

    for (const member of found) {
      if (member.rankId === QUIT_RANK_ID) skipped.push({ member, error: memberErrors.alreadyQuit() });
      else changed.push({ member });
    }

    await setMemberRanks(
      tx,
      changed.map(({ member }) => ({ memberId: member.id, rankId: QUIT_RANK_ID }))
    );
    await recordAuditEntries(tx, auth, "member_left", changed, () => note);

    return { changed, skipped };
  });
}

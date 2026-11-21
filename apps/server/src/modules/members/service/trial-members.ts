import { type Transaction, db } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import type { ActingAuth } from "@/modules/auth/hooks/authenticate";
import { listMembersByDiscordId } from "@/modules/members/repository/list-members-by-discord-id";
import { saveMember } from "@/modules/members/repository/save-member";
import { startMemberTrial } from "@/modules/members/repository/start-member-trial";
import type { NewMember, TrialistBatch } from "@/modules/members/request";

export async function trialMembers({ trialists }: TrialistBatch, auth: ActingAuth) {
  return db.transaction(async (tx) => {
    const found = await listMembersByDiscordId(
      tx,
      trialists.map(({ discordId }) => discordId)
    );

    const results = [];
    for (const trialist of trialists) {
      const existing = found.get(trialist.discordId);

      if (existing) {
        const pointsCleared = await rejoinClan(tx, existing, auth);
        results.push({ ...trialist, memberId: existing.id, outcome: "retrialling" as const, pointsCleared });
      } else {
        const memberId = await joinClan(tx, trialist, auth);
        results.push({ ...trialist, memberId, outcome: "trialling" as const, pointsCleared: 0 });
      }
    }

    return results;
  });
}

async function joinClan(tx: Transaction, trialist: NewMember, auth: ActingAuth) {
  const memberId = await saveMember(tx, trialist);
  await recordAuditEntry(tx, {
    actingMemberId: auth.member.id,
    action: "member_joined",
    affects: [memberId],
    note: `${trialist.displayName} has joined the clan`,
    source: auth.client
  });

  return memberId;
}

type FormerMember = {
  displayName: string;
  id: bigint;
};

async function rejoinClan(tx: Transaction, member: FormerMember, auth: ActingAuth) {
  const restarted = await startMemberTrial(tx, member.id);
  const pointsCleared = restarted?.pointsCleared ?? 0;
  await recordAuditEntry(tx, {
    actingMemberId: auth.member.id,
    action: "member_joined",
    affects: [member.id],
    note: `${member.displayName} has rejoined the clan, clearing ${pointsCleared} points`,
    source: auth.client
  });

  return pointsCleared;
}

import { db } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";

import { listMembersByDiscordId } from "../repository/list-members-by-discord-id";
import { saveMember } from "../repository/save-member";
import { startMemberTrial } from "../repository/start-member-trial";

export type NewTrialist = {
  altRsn: string | null;
  discordId: bigint;
  displayName: string;
  mainRsn: string;
};

export type TrialCommand = {
  actingMemberId?: bigint;
  trialists: NewTrialist[];
};

export const trialMembers = async ({ actingMemberId, trialists }: TrialCommand) =>
  db.transaction(async (tx) => {
    const found = await listMembersByDiscordId(
      tx,
      trialists.map(({ discordId }) => discordId)
    );

    const results = [];
    for (const trialist of trialists) {
      const existing = found.get(trialist.discordId);

      if (!existing) {
        const memberId = await saveMember(tx, trialist);
        await recordAuditEntry(tx, {
          actingMemberId,
          action: "member_joined",
          affects: [memberId],
          note: `${trialist.displayName} has joined the clan`,
          source: "server"
        });

        results.push({ ...trialist, memberId, outcome: "trialling" as const, pointsCleared: 0 });
        continue;
      }

      const restarted = await startMemberTrial(tx, existing.id);
      await recordAuditEntry(tx, {
        actingMemberId,
        action: "member_joined",
        affects: [existing.id],
        note: `${existing.displayName} has rejoined the clan, clearing ${restarted?.pointsCleared ?? 0} points`,
        source: "server"
      });

      results.push({
        ...trialist,
        memberId: existing.id,
        outcome: "retrialling" as const,
        pointsCleared: restarted?.pointsCleared ?? 0
      });
    }

    return results;
  });

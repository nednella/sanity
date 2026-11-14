import type { Transaction } from "@db/index";

import type { ActingAuth } from "@/modules/auth/hooks/authenticate";

import { type AuditEntry, recordAuditEntry } from "./record-audit-entry";

type MemberChange = { member: { id: bigint } };

// Members that share a note share one entry.
export async function recordAuditEntries<Change extends MemberChange>(
  tx: Transaction,
  auth: ActingAuth,
  action: AuditEntry["action"],
  changes: Change[],
  toNote: (change: Change) => string | undefined
) {
  const changesByNote = Map.groupBy(changes, toNote);

  for (const [note, group] of changesByNote) {
    await recordAuditEntry(tx, {
      actingMemberId: auth.member.id,
      action,
      affects: group.map(({ member }) => member.id),
      note,
      source: auth.client
    });
  }
}

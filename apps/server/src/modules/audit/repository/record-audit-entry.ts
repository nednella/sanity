import type { Transaction } from "@db/index";
import { auditLog, auditLogMembers } from "@db/schema";

export type AuditEntry = {
  actingMemberId?: bigint;
  action: (typeof auditLog.$inferInsert)["action"];
  affects?: bigint[];
  note?: string;
  source: (typeof auditLog.$inferInsert)["source"];
};

export const recordAuditEntry = async (tx: Transaction, { affects = [], ...entry }: AuditEntry) => {
  const [recorded] = await tx
    .insert(auditLog)
    .values({ ...entry, occurredAt: new Date() })
    .returning({ id: auditLog.id });

  const unique = [...new Set(affects)];
  if (unique.length > 0) {
    await tx.insert(auditLogMembers).values(unique.map((memberId) => ({ auditLogId: recorded!.id, memberId })));
  }

  return recorded!.id;
};

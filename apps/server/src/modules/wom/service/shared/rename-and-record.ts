import type { Transaction } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";

import { renameMember } from "../../repository/rename-member";

export const renameAndRecord = async (tx: Transaction, memberId: bigint, mainRsn: string) => {
  const renamed = await renameMember(tx, memberId, mainRsn);
  if (!renamed) return false;

  await recordAuditEntry(tx, {
    action: "rsn_changed",
    affects: [memberId],
    note: renamed.previous ? `${renamed.previous} to ${mainRsn}` : `set to ${mainRsn}`,
    source: "worker"
  });

  return true;
};

import { db } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";

import { type BossRow, saveBosses } from "../repository/save-bosses";

export const importBosses = async (rows: BossRow[]) => {
  if (rows.length === 0) return 0;

  return db.transaction(async (tx) => {
    const saved = await saveBosses(tx, rows);

    await recordAuditEntry(tx, {
      action: "catalogue_changed",
      note: `${saved} bosses saved`,
      source: "server"
    });

    return saved;
  });
};

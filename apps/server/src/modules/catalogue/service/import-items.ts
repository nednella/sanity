import { db } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";

import { type ItemRow, saveItems } from "../repository/save-items";

export const importItems = async (rows: ItemRow[]) => {
  if (rows.length === 0) return 0;

  return db.transaction(async (tx) => {
    const saved = await saveItems(tx, rows);

    await recordAuditEntry(tx, {
      action: "catalogue_changed",
      note: `${saved} items saved`,
      source: "server"
    });

    return saved;
  });
};

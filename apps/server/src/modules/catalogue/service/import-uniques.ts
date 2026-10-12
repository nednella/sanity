import { db } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";

import { type UniqueRow, saveUniques } from "../repository/save-uniques";

export const importUniques = async (rows: UniqueRow[]) => {
  if (rows.length === 0) return 0;

  return db.transaction(async (tx) => {
    const saved = await saveUniques(tx, rows);

    await recordAuditEntry(tx, {
      action: "catalogue_changed",
      note: `${saved} uniques saved`,
      source: "server"
    });

    return saved;
  });
};

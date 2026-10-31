import { inArray } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { members } from "@db/schema";

export async function setPluginAccessRevokedAt(
  tx: Transaction,
  memberIds: bigint[],
  pluginAccessRevokedAt: Date | null
) {
  if (memberIds.length === 0) return;

  await tx.update(members).set({ pluginAccessRevokedAt }).where(inArray(members.id, memberIds));
}

import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { members } from "@db/schema";

export async function setPluginAccessRevokedAt(tx: Transaction, memberId: bigint, pluginAccessRevokedAt: Date | null) {
  await tx.update(members).set({ pluginAccessRevokedAt }).where(eq(members.id, memberId));
}

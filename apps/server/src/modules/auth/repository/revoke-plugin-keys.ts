import { and, eq, inArray, isNull } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { apiKeys } from "@db/schema";

export async function revokePluginKeys(tx: Transaction, memberIds: bigint[]) {
  await tx
    .update(apiKeys)
    .set({ revokedAt: new Date() })
    .where(and(eq(apiKeys.client, "plugin"), inArray(apiKeys.memberId, memberIds), isNull(apiKeys.revokedAt)));
}

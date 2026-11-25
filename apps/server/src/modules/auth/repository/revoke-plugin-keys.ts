import { and, eq, inArray, isNull } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { authKeys } from "@db/schema";

export async function revokePluginKeys(tx: Transaction, memberIds: bigint[]) {
  await tx
    .update(authKeys)
    .set({ revokedAt: new Date() })
    .where(and(eq(authKeys.client, "plugin"), inArray(authKeys.memberId, memberIds), isNull(authKeys.revokedAt)));
}

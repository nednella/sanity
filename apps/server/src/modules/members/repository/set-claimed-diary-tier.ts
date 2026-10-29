import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { members } from "@db/schema";

export async function setClaimedDiaryTier(tx: Transaction, memberId: bigint, tierId: number) {
  await tx.update(members).set({ claimedDiaryTierId: tierId }).where(eq(members.id, memberId));
}

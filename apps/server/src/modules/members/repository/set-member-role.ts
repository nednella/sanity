import { eq } from "drizzle-orm";

import type { MemberRole } from "@db/enums";
import type { Transaction } from "@db/index";
import { members } from "@db/schema";

export async function setMemberRole(tx: Transaction, memberId: bigint, role: MemberRole | null) {
  await tx.update(members).set({ role }).where(eq(members.id, memberId));
}

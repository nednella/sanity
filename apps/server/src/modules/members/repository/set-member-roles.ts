import { inArray } from "drizzle-orm";

import type { MemberRole } from "@db/enums";
import type { Transaction } from "@db/index";
import { members } from "@db/schema";

export async function setMemberRoles(tx: Transaction, memberIds: bigint[], role: MemberRole | null) {
  if (memberIds.length === 0) return;

  await tx.update(members).set({ role }).where(inArray(members.id, memberIds));
}

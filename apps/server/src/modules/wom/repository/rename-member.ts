import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { members } from "@db/schema";

// Returns the name replaced, so the caller can record what the change actually was, or undefined
// when we already hold this name.
export const renameMember = async (tx: Transaction, memberId: bigint, mainRsn: string) => {
  const [member] = await tx.select({ mainRsn: members.mainRsn }).from(members).where(eq(members.id, memberId));
  if (!member || member.mainRsn === mainRsn) return;

  await tx.update(members).set({ mainRsn }).where(eq(members.id, memberId));

  return { previous: member.mainRsn };
};

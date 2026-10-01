import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { members } from "@db/schema";

import { normaliseRsn } from "./shared/normalise-rsn";

// Returns the name replaced, so the caller can record what the change actually was, or nothing when
// we already hold this name. Wise Old Man reports every name with spaces, so a stored name that
// differs only by an underscore or hyphen is the same name and is left as the member wrote it.
export const renameMember = async (tx: Transaction, memberId: bigint, mainRsn: string) => {
  const [member] = await tx.select({ mainRsn: members.mainRsn }).from(members).where(eq(members.id, memberId));
  if (!member) return;
  if (member.mainRsn !== null && normaliseRsn(member.mainRsn) === normaliseRsn(mainRsn)) return;

  await tx.update(members).set({ mainRsn }).where(eq(members.id, memberId));

  return { previous: member.mainRsn };
};

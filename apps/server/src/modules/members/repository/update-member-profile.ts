import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { members } from "@db/schema";

export type ProfileChanges = {
  altRsn?: string | null;
  birthday?: string | null;
  mainRsn?: string;
  nationality?: string | null;
};

export async function updateMemberProfile(tx: Transaction, memberId: bigint, profile: ProfileChanges) {
  const [member] = await tx
    .select({ altRsn: members.altRsn, mainRsn: members.mainRsn })
    .from(members)
    .where(eq(members.id, memberId));
  if (!member) return;

  if (Object.keys(profile).length > 0) {
    await tx.update(members).set(profile).where(eq(members.id, memberId));
  }

  return member;
}

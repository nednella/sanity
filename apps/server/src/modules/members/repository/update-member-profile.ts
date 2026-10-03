import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { members } from "@db/schema";

export type MemberProfile = {
  altRsn?: string | null;
  birthday?: string | null;
  mainRsn?: string;
  nationality?: string;
};

export const updateMemberProfile = async (tx: Transaction, memberId: bigint, profile: MemberProfile) => {
  const [member] = await tx
    .select({ altRsn: members.altRsn, mainRsn: members.mainRsn })
    .from(members)
    .where(eq(members.id, memberId));
  if (!member) return;

  if (Object.keys(profile).length > 0) {
    await tx.update(members).set(profile).where(eq(members.id, memberId));
  }

  return member;
};

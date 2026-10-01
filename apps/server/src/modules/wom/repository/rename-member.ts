import { and, eq, isNull, ne, or } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { members } from "@db/schema";

export const renameMember = async (tx: Transaction, memberId: bigint, mainRsn: string) => {
  const hasNewName = or(isNull(members.mainRsn), ne(members.mainRsn, mainRsn));

  const renamed = await tx
    .update(members)
    .set({ mainRsn })
    .where(and(eq(members.id, memberId), hasNewName))
    .returning({ id: members.id });

  return renamed.length > 0;
};

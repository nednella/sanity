import { and, eq, isNull, ne, or } from "drizzle-orm";

import { db } from "@db/index";
import { members } from "@db/schema";

export const renameMember = async (memberId: bigint, mainRsn: string) => {
  const hasNewName = or(isNull(members.mainRsn), ne(members.mainRsn, mainRsn));

  const renamed = await db
    .update(members)
    .set({ mainRsn })
    .where(and(eq(members.id, memberId), hasNewName))
    .returning({ id: members.id });

  return renamed.length > 0;
};

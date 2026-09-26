import { desc, eq } from "drizzle-orm";

import { db } from "@db/index";
import { womNameChanges } from "@db/schema";

export const listNameChanges = (womPlayerId: number) =>
  db
    .select({
      name: womNameChanges.oldName,
      until: womNameChanges.resolvedAt
    })
    .from(womNameChanges)
    .where(eq(womNameChanges.womPlayerId, womPlayerId))
    .orderBy(desc(womNameChanges.resolvedAt));

export type NameChange = Awaited<ReturnType<typeof listNameChanges>>[number];

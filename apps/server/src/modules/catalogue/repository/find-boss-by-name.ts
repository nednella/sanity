import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { bosses } from "@db/schema";

export async function findBossByName(tx: Transaction, name: string) {
  const [boss] = await tx
    .select({
      id: bosses.id,
      name: bosses.name
    })
    .from(bosses)
    .where(eq(bosses.name, name));

  return boss;
}

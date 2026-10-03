import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { ranks } from "@db/schema";

export const findRank = async (tx: Transaction, id: number) => {
  const [rank] = await tx.select({ id: ranks.id, name: ranks.name }).from(ranks).where(eq(ranks.id, id));
  return rank;
};

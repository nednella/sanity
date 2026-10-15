import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { items } from "@db/schema";

export type ItemValue = Awaited<ReturnType<typeof findItemValue>>;

export const findItemValue = async (tx: Transaction, id: number) => {
  const [found] = await tx
    .select({
      valueMillions: items.valueMillions,
      valueRule: items.valueRule
    })
    .from(items)
    .where(eq(items.id, id));

  return found;
};

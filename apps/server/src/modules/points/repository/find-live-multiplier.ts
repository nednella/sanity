import { and, desc, eq, gt, inArray, isNull, lte, or } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { bossUniques, pointMultipliers } from "@db/schema";

export type MultiplierMatch = {
  at: Date;
  itemId: number | null;
  memberIds: bigint[];
};

function matchBoss(tx: Transaction, itemId: number | null) {
  const anyBoss = isNull(pointMultipliers.bossId);
  if (itemId === null) return anyBoss;

  const droppedBy = tx.select({ bossId: bossUniques.bossId }).from(bossUniques).where(eq(bossUniques.itemId, itemId));
  return or(anyBoss, inArray(pointMultipliers.bossId, droppedBy));
}

export async function findLiveMultiplier(tx: Transaction, { at, itemId, memberIds }: MultiplierMatch) {
  const isLive = and(lte(pointMultipliers.startsAt, at), gt(pointMultipliers.endsAt, at));
  const matchesMember = or(isNull(pointMultipliers.memberId), inArray(pointMultipliers.memberId, memberIds));

  const [strongest] = await tx
    .select({
      id: pointMultipliers.id,
      value: pointMultipliers.value
    })
    .from(pointMultipliers)
    .where(and(isLive, matchesMember, matchBoss(tx, itemId)))
    .orderBy(desc(pointMultipliers.value))
    .limit(1);

  return strongest;
}

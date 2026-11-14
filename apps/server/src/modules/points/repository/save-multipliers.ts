import type { Transaction } from "@db/index";
import { pointMultipliers } from "@db/schema";

export type NewMultiplier = typeof pointMultipliers.$inferInsert;

export async function saveMultipliers(tx: Transaction, multipliers: NewMultiplier[]) {
  return tx.insert(pointMultipliers).values(multipliers).returning({
    id: pointMultipliers.id,
    memberId: pointMultipliers.memberId,
    value: pointMultipliers.value,
    reason: pointMultipliers.reason,
    startsAt: pointMultipliers.startsAt,
    endsAt: pointMultipliers.endsAt
  });
}

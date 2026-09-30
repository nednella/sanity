import { sql } from "drizzle-orm";

import type { Queryable } from "@db/index";
import { members, points } from "@db/schema";

export type Award = {
  memberId: bigint;
  points: number;
};

export const awardPoints = async (tx: Queryable, awards: Award[], submissionId: number | null, notes: string) => {
  const earned = awards.filter(({ points: value }) => value !== 0);
  if (earned.length === 0) return 0;

  await tx.insert(points).values(
    earned.map(({ memberId, points: value }) => ({
      awardedAt: new Date(),
      memberId,
      notes,
      submissionId,
      value
    }))
  );

  // One statement rather than one per member: a five man team earning two tiers would otherwise
  // spend ten round trips inside the transaction.
  const totals = sql.join(
    earned.map(({ memberId, points: value }) => sql`(${memberId}::bigint, ${value}::int)`),
    sql`, `
  );

  await tx.execute(sql`
    update ${members} set clan_points = ${members.clanPoints} + awarded.points
    from (values ${totals}) as awarded(member_id, points)
    where ${members.id} = awarded.member_id
  `);

  return earned.length;
};

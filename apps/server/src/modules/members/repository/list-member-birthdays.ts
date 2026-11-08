import { and, eq, lte, sql } from "drizzle-orm";

import { db } from "@db/index";
import { discordAccounts, members } from "@db/schema";

import type { Timeframe } from "@/schema/common";

export function listMemberBirthdays({ from, to }: Timeframe) {
  const { birthday } = members;

  const ageInYearOfFrom = sql`(extract(year from ${from}::date) - extract(year from ${birthday}))::int`;
  const birthdayInYearOfFrom = sql`${birthday} + make_interval(years => ${ageInYearOfFrom})`;
  const isBirthdayBeforeFrom = sql`(${birthdayInYearOfFrom} < ${from}::date)::int`;

  const nextAge = sql<number>`${ageInYearOfFrom} + ${isBirthdayBeforeFrom}`;
  // Adding years to 29 February gives 28 February in the years without that day.
  const nextBirthday = sql<string>`(${birthday} + make_interval(years => ${nextAge}))::date`;

  return db
    .select({
      member: {
        id: members.id,
        discordId: discordAccounts.discordId,
        displayName: members.displayName
      },
      date: sql<string>`${nextBirthday}::text`,
      age: nextAge
    })
    .from(members)
    .innerJoin(discordAccounts, eq(discordAccounts.memberId, members.id))
    .where(and(eq(members.isActive, true), lte(nextBirthday, to)))
    .orderBy(nextBirthday, members.displayName);
}

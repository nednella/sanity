import { asc, or, sql } from "drizzle-orm";

import { db } from "@db/index";
import { members } from "@db/schema";

/**
 * Finds the member who goes by this name. When two members share it, a display name beats a main
 * RSN, a main RSN beats an alt RSN, and then the older member wins.
 */
export async function findMemberIdByName(name: string) {
  const displayNameMatches = sql`lower(${members.displayName}) = lower(${name})`;
  const mainRsnMatches = sql`lower(${members.mainRsn}) = lower(${name})`;
  const altRsnMatches = sql`lower(${members.altRsn}) = lower(${name})`;

  const [member] = await db
    .select({ id: members.id })
    .from(members)
    .where(or(displayNameMatches, mainRsnMatches, altRsnMatches))
    .orderBy(sql`case when ${displayNameMatches} then 0 when ${mainRsnMatches} then 1 else 2 end`, asc(members.id))
    .limit(1);

  return member?.id;
}

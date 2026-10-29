import { eq, ilike, or } from "drizzle-orm";

import { members } from "@db/schema";

export function isActive(active: boolean | undefined) {
  return active === undefined ? undefined : eq(members.isActive, active);
}

// A member is found by any of the names they go by, so one box searches all three.
export function matchesSearch(search: string | undefined) {
  if (!search) return;

  const pattern = `%${search.replaceAll(/[%_]/g, String.raw`\$&`)}%`;
  return or(ilike(members.displayName, pattern), ilike(members.mainRsn, pattern), ilike(members.altRsn, pattern));
}

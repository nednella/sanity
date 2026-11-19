import { and, eq, gt, sql } from "drizzle-orm";

import { db } from "@db/index";
import { sessions } from "@db/schema";

import { SESSION_IDLE_DAYS, SESSION_LIFETIME_DAYS } from "../constants";

/**
 * Finds the live session with the given hash, stamps its `last_used_at` and
 * moves its expiry to `SESSION_IDLE_DAYS` from now. The expiry never moves
 * past `SESSION_LIFETIME_DAYS` after sign-in.
 *
 * Returns the session's member id, else `undefined` when no session is found,
 * or the session has expired.
 */
export async function validateSession(secretHash: string) {
  const [session] = await db
    .update(sessions)
    .set({
      expiresAt: sql`least(
        now() + make_interval(days => ${SESSION_IDLE_DAYS}),
        ${sessions.createdAt} + make_interval(days => ${SESSION_LIFETIME_DAYS})
      )`,
      lastUsedAt: sql`now()`
    })
    .where(and(eq(sessions.secretHash, secretHash), gt(sessions.expiresAt, sql`now()`)))
    .returning({ memberId: sessions.memberId });

  return session;
}

import { and, eq, gt } from "drizzle-orm";

import { relativeDate } from "@sanity/utils";

import { db } from "@db/index";
import { authSessions } from "@db/schema";

import { SESSION_IDLE_DAYS, SESSION_LIFETIME_DAYS } from "@/modules/auth/utils/cookies";

/**
 * Finds the live session with the given hash, stamps its `last_used_at` and
 * slides its expiry to `SESSION_IDLE_DAYS` from now. A session older than
 * `SESSION_LIFETIME_DAYS` is considered permanently expired.
 *
 * Returns the session's ID and member ID, else `undefined` when no session is
 * found, or the session has expired.
 */
export async function validateSession(secretHash: string) {
  const now = new Date();

  const [session] = await db
    .update(authSessions)
    .set({
      lastUsedAt: now,
      expiresAt: relativeDate({ days: SESSION_IDLE_DAYS }, now)
    })
    .where(
      and(
        eq(authSessions.secretHash, secretHash),
        gt(authSessions.expiresAt, now),
        gt(authSessions.createdAt, relativeDate({ days: -SESSION_LIFETIME_DAYS }, now))
      )
    )
    .returning({
      id: authSessions.id,
      memberId: authSessions.memberId
    });

  return session;
}

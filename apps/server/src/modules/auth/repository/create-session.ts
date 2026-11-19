import { and, desc, eq, lte, notInArray, sql } from "drizzle-orm";

import { db } from "@db/index";
import { members, sessions } from "@db/schema";

import { SESSION_IDLE_DAYS, SESSION_LIMIT } from "../constants";

/**
 * Saves a new session for a member. Ensure the caller NEVER passes the secret
 * itself, only its hash.
 *
 * The member's expired sessions go, and so do the oldest ones past
 * `SESSION_LIMIT`. The transaction first locks the member row, so two
 * sign-ins at the same time cannot both keep more than the limit.
 */
export function createSession(session: Omit<typeof sessions.$inferInsert, "expiresAt">) {
  return db.transaction(async (tx) => {
    await tx.select({ id: members.id }).from(members).where(eq(members.id, session.memberId)).for("update");

    await tx.insert(sessions).values({
      ...session,
      expiresAt: sql`now() + make_interval(days => ${SESSION_IDLE_DAYS})`
    });

    await tx.delete(sessions).where(and(eq(sessions.memberId, session.memberId), lte(sessions.expiresAt, sql`now()`)));

    const newest = tx
      .select({ id: sessions.id })
      .from(sessions)
      .where(eq(sessions.memberId, session.memberId))
      .orderBy(desc(sessions.id))
      .limit(SESSION_LIMIT);

    await tx.delete(sessions).where(and(eq(sessions.memberId, session.memberId), notInArray(sessions.id, newest)));
  });
}

import { db } from "@db/index";
import { authSessions } from "@db/schema";

/**
 * Saves a new session and returns its ID. Ensure the caller NEVER passes the
 * secret itself, only its hash.
 */
export async function saveSession(session: typeof authSessions.$inferInsert) {
  const [created] = await db.insert(authSessions).values(session).returning({ id: authSessions.id });
  return created!.id;
}

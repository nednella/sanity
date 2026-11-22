import { db } from "@db/index";
import { sessions } from "@db/schema";

/**
 * Saves a new session and returns its ID. Ensure the caller NEVER passes the
 * secret itself, only its hash.
 */
export async function saveSession(session: typeof sessions.$inferInsert) {
  const [created] = await db.insert(sessions).values(session).returning({ id: sessions.id });
  return created!.id;
}

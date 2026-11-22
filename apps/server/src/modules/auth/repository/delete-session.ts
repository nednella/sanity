import { eq } from "drizzle-orm";

import { db } from "@db/index";
import { sessions } from "@db/schema";

/**
 * Deletes the session with the given hash, so it no longer authenticates.
 */
export async function deleteSession(secretHash: string) {
  await db.delete(sessions).where(eq(sessions.secretHash, secretHash));
}

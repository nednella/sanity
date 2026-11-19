import { eq } from "drizzle-orm";

import { db } from "@db/index";
import { sessions } from "@db/schema";

export async function deleteSession(secretHash: string) {
  await db.delete(sessions).where(eq(sessions.secretHash, secretHash));
}

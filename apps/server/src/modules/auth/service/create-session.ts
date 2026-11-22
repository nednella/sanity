import { relativeDate } from "@sanity/utils";

import { saveSession } from "@/modules/auth/repository/save-session";
import { SESSION_IDLE_DAYS } from "@/modules/auth/utils/cookies";
import { generateKey, hashKey } from "@/modules/auth/utils/keys";

/**
 * Creates a session for the member and returns the secret for their session
 * cookie. The secret is never stored, only its hash.
 */
export async function createSession(memberId: bigint, userAgent: string | undefined) {
  const secret = generateKey("web");
  await saveSession({
    expiresAt: relativeDate({ days: SESSION_IDLE_DAYS }),
    memberId,
    secretHash: hashKey(secret),
    userAgent
  });

  return secret;
}

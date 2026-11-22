import type { FastifyReply } from "fastify";

import { SESSION_COOKIE_NAME, sessionCookieOptions } from "@/modules/auth/utils/cookies";

/**
 * Clears the session cookie and answers with no content.
 */
export function sendLoggedOut(reply: FastifyReply) {
  reply.clearCookie(SESSION_COOKIE_NAME, sessionCookieOptions);
  reply.code(204).send();
}

import type { FastifyRequest } from "fastify";

import { authErrors } from "@/modules/auth/errors";
import { authorizationResponseQuery } from "@/modules/auth/request";
import { OAUTH_STATE_COOKIE_NAME } from "@/modules/auth/utils/cookies";

/**
 * Rejects an authorization response whose `state` differs from the one the
 * user-agent kept when the client sent the authorization request, or that
 * carries an `error`. As defined by the OAuth 2.0 standard, RFC 6749, section
 * 4.1.2, the authorization server returns "the exact value received from the
 * client".
 *
 * Runs before validation, because an error response has no `code`.
 *
 * see: https://www.rfc-editor.org/rfc/rfc6749#section-4.1.2
 */
export async function checkAuthorizationResponse(request: FastifyRequest) {
  const response = authorizationResponseQuery.safeParse(request.query);
  if (!response.success) throw authErrors.loginFailed();

  const { error, state } = response.data;
  if (state !== request.cookies[OAUTH_STATE_COOKIE_NAME]) throw authErrors.loginFailed();
  if (error !== undefined) throw authErrors.authorizationError(error);
}

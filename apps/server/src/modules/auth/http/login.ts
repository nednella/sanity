import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";

import { config } from "@config";

import type { ApplicationError } from "@/errors/error";
import { toApplicationError } from "@/errors/handlers";
import {
  OAUTH_STATE_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  oauthStateCookieOptions,
  sessionCookieOptions
} from "@/modules/auth/utils/cookies";

const { webUrl } = config;

/**
 * As defined by the OAuth 2.0 standard, RFC 6749, section 4.1:
 *
 * Initiates the OAuth 2.0 Authorization flow by  directing the resource
 * owner's user-agent to the authorization endpoint. The client includes its
 * client identifier, requested scope, local state, and a redirection URI to
 * which the authorization server will send the user-agent back once access is
 * granted (or denied).
 *
 * see: https://www.rfc-editor.org/rfc/rfc6749#section-4.1
 */
export function redirectToOAuthProvider(reply: FastifyReply, state: string, url: string) {
  reply.setCookie(OAUTH_STATE_COOKIE_NAME, state, oauthStateCookieOptions);
  reply.redirect(url);
}

/**
 * Completes a granted authorization: drops the `state`, sets the new session
 * cookie and sends the user-agent back to the web client.
 *
 * see: https://www.rfc-editor.org/rfc/rfc6749#section-4.1.2
 */
export function redirectOAuthProviderSuccess(reply: FastifyReply, secret: string) {
  reply.clearCookie(OAUTH_STATE_COOKIE_NAME, oauthStateCookieOptions);
  reply.setCookie(SESSION_COOKIE_NAME, secret, sessionCookieOptions);
  reply.redirect(webUrl);
}

/**
 * Ends a failed authorization: drops the `state` and sends the user-agent back
 * to the web client with the error code in `?auth=failed&error=`. The callback
 * route uses this as its error handler, so an error response, a `state` that
 * does not match and a server error all end here. As defined by the OAuth 2.0
 * standard, RFC 6749, section 4.1.2.1:
 *
 * If the resource owner denies the access request or if the request fails for
 * reasons other than a missing or invalid redirection URI, the authorization
 * server informs the client by adding the following parameters to the query
 * component of the redirection URI.
 *
 * see: https://www.rfc-editor.org/rfc/rfc6749#section-4.1.2.1
 */
export function redirectOAuthLoginError(
  error: ApplicationError | FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { code, statusCode } = toApplicationError(error);
  if (statusCode >= 500) request.log.error({ err: error, message: "LOGIN FAILED!" });

  reply.clearCookie(OAUTH_STATE_COOKIE_NAME, oauthStateCookieOptions);
  reply.redirect(`${webUrl}/?${new URLSearchParams({ auth: "failed", error: code })}`);
}

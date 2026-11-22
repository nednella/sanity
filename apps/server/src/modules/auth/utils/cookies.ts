import type { CookieSerializeOptions } from "@fastify/cookie";

// __Host prefix acts as a validator for secure cookie settings,
// but not every browser supports it.
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#cookie_prefixes
export const SESSION_COOKIE_NAME = "__Host-sanity_session";
export const OAUTH_STATE_COOKIE_NAME = "__Host-sanity_oauth_state";
export const OAUTH_REDIRECT_COOKIE_NAME = "__Host-sanity_oauth_redirect";

export const SESSION_IDLE_DAYS = 14;
export const SESSION_LIFETIME_DAYS = 90;

const SESSION_MAX_AGE = SESSION_LIFETIME_DAYS * 60 * 60 * 24;
const OAUTH_STATE_MAX_AGE = 60 * 10;

export const sessionCookieOptions: CookieSerializeOptions = {
  httpOnly: true,
  maxAge: SESSION_MAX_AGE,
  path: "/",
  sameSite: "strict",
  secure: true
};

/**
 * Keeps the OAuth state in the browser that started the sign-in, as defined by
 * the OAuth 2.0 standard, RFC 6749, section 10.12:
 *
 * The client MUST implement CSRF protection for its redirection URI. This is
 * typically accomplished by requiring any request sent to the redirection URI
 * endpoint to include a value that binds the request to the user-agent's
 * authenticated state.
 *
 * Discord's redirect back to the callback is a cross-site navigation, so the
 * cookie is `lax`. The browser does not send a `strict` cookie on it.
 *
 * see: https://www.rfc-editor.org/rfc/rfc6749#section-10.12
 */
export const oauthStateCookieOptions: CookieSerializeOptions = {
  httpOnly: true,
  maxAge: OAUTH_STATE_MAX_AGE,
  path: "/",
  sameSite: "lax",
  secure: true
};

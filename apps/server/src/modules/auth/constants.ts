import type { CookieSerializeOptions } from "@fastify/cookie";

// __Host prefix acts as a validator for secure cookie settings,
// but not every browser supports it.
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#cookie_prefixes
export const SESSION_COOKIE_NAME = "__Host-sanity_session";

export const SESSION_IDLE_DAYS = 14;
export const SESSION_LIFETIME_DAYS = 90;

const SESSION_MAX_AGE = SESSION_LIFETIME_DAYS * 60 * 60 * 24;

export const sessionCookieOptions: CookieSerializeOptions = {
  httpOnly: true,
  maxAge: SESSION_MAX_AGE,
  path: "/",
  sameSite: "strict",
  secure: true
};

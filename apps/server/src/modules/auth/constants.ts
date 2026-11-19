import type { CookieSerializeOptions } from "@fastify/cookie";

export const SESSION_IDLE_DAYS = 14;
export const SESSION_LIFETIME_DAYS = 90;
export const SESSION_LIMIT = 3;

export const SESSION_COOKIE = "__Host-session";
export const STATE_COOKIE = "__Host-oauth-state";

export const sessionCookie: CookieSerializeOptions = {
  httpOnly: true,
  maxAge: SESSION_LIFETIME_DAYS * 24 * 60 * 60,
  path: "/",
  sameSite: "strict",
  secure: true
};

// Lax, because Discord's redirect back to the callback is a cross-site
// navigation, and the browser does not send a strict cookie on it.
export const stateCookie: CookieSerializeOptions = {
  httpOnly: true,
  maxAge: 10 * 60,
  path: "/",
  sameSite: "lax",
  secure: true
};

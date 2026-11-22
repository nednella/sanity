import { randomBytes } from "node:crypto";

const STATE_BYTES = 32;

/**
 * As defined by the OAuth 2.0 standard, RFC 6749, section 4.1.1:
 *
 * An opaque value used by the client to maintain state between the request and
 * callback. The authorization server includes this value when redirecting the
 * user-agent back to the client.
 *
 * see: https://www.rfc-editor.org/info/rfc6749/#section-4.1.1
 */
export function generateOAuthState() {
  return randomBytes(STATE_BYTES).toString("base64url");
}
